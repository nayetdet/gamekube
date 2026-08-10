.PHONY: bootstrap

bootstrap:
	kind get clusters | grep -qx gamekube || kind create cluster --name gamekube --config kind/config.yaml
	helm upgrade --install ingress helm/ingress \
		--namespace ingress \
		--create-namespace \
		--wait
	helm upgrade --install gamekube helm/gamekube \
		--namespace gamekube \
		--create-namespace \
		--wait
