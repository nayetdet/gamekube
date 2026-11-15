package io.github.nayetdet.gamekube.service;

import io.github.nayetdet.gamekube.exception.StorageException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.exception.SdkException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.Delete;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectsRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.ObjectIdentifier;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Object;
import software.amazon.awssdk.services.s3.paginators.ListObjectsV2Iterable;

@Service
@RequiredArgsConstructor
public class StorageService {

  private static final int DELETE_BATCH_SIZE = 1000;

  private final S3Client s3Client;

  public record StorageObject(byte[] content, String contentType) {}

  public void putObject(String bucket, String key, byte[] content, String contentType) {
    try {
      s3Client.putObject(
          PutObjectRequest.builder().bucket(bucket).key(key).contentType(contentType).build(),
          RequestBody.fromBytes(content));
    } catch (SdkException exception) {
      throw new StorageException(exception);
    }
  }

  public Optional<StorageObject> getObject(String bucket, String key) {
    try {
      ResponseBytes<GetObjectResponse> response =
          s3Client.getObjectAsBytes(GetObjectRequest.builder().bucket(bucket).key(key).build());
      return Optional.of(
          new StorageObject(response.asByteArray(), response.response().contentType()));
    } catch (NoSuchKeyException exception) {
      return Optional.empty();
    } catch (SdkException exception) {
      throw new StorageException(exception);
    }
  }

  public void deleteObject(String bucket, String key) {
    try {
      s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(key).build());
    } catch (SdkException exception) {
      throw new StorageException(exception);
    }
  }

  public List<String> listKeys(String bucket, String prefix) {
    try {
      ListObjectsV2Iterable pages =
          s3Client.listObjectsV2Paginator(
              ListObjectsV2Request.builder().bucket(bucket).prefix(prefix).build());
      List<String> keys = new ArrayList<>();
      for (S3Object object : pages.contents()) {
        if (!object.key().endsWith("/")) {
          keys.add(object.key());
        }
      }
      return keys;
    } catch (SdkException exception) {
      throw new StorageException(exception);
    }
  }

  public void writePrefixAsZip(
      String bucket, String prefix, List<String> keys, OutputStream outputStream)
      throws IOException {
    try (ZipOutputStream zip = new ZipOutputStream(outputStream)) {
      for (String key : keys) {
        String entryName = key.startsWith(prefix) ? key.substring(prefix.length()) : key;
        if (entryName.isEmpty()) {
          continue;
        }
        zip.putNextEntry(new ZipEntry(entryName));
        try (InputStream objectStream =
            s3Client.getObject(GetObjectRequest.builder().bucket(bucket).key(key).build())) {
          objectStream.transferTo(zip);
        } catch (SdkException exception) {
          throw new StorageException(exception);
        }
        zip.closeEntry();
      }
      zip.finish();
    }
  }

  public void deleteObjects(String bucket, List<String> keys) {
    if (keys.isEmpty()) {
      return;
    }

    try {
      for (int i = 0; i < keys.size(); i += DELETE_BATCH_SIZE) {
        List<ObjectIdentifier> batch =
            keys.subList(i, Math.min(i + DELETE_BATCH_SIZE, keys.size())).stream()
                .map(key -> ObjectIdentifier.builder().key(key).build())
                .toList();

        s3Client.deleteObjects(
            DeleteObjectsRequest.builder()
                .bucket(bucket)
                .delete(Delete.builder().objects(batch).build())
                .build());
      }
    } catch (SdkException exception) {
      throw new StorageException(exception);
    }
  }
}
