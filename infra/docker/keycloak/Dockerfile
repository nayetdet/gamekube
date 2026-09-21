FROM quay.io/keycloak/keycloak:26.7
COPY import/gamekube-realm.json /opt/keycloak/data/import/
COPY providers/keycloak-authentication-postgres.jar /opt/keycloak/providers/
COPY themes/keywind/theme/keywind/ /opt/keycloak/themes/keywind/
