.PHONY: up down reset

up:
	kind get clusters | grep -qx gamekube || kind create cluster --name gamekube --config kind/config.yaml
	helm upgrade --install cert-manager helm/platform/cert-manager \
		--namespace cert-manager \
		--create-namespace \
		--wait

	helm upgrade --install ingress helm/platform/ingress \
		--namespace ingress \
		--create-namespace \
		--wait

	helm upgrade --install gamekube helm/applications/gamekube \
		--namespace gamekube \
		--create-namespace \
		--wait

down:
	kind get clusters | grep -qx gamekube && kind delete cluster --name gamekube || true

reset: down up
