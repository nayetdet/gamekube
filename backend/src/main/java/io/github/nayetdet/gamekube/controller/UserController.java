package io.github.nayetdet.gamekube.controller;

import io.github.nayetdet.gamekube.controller.docs.UserControllerDocs;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserController implements UserControllerDocs {}
