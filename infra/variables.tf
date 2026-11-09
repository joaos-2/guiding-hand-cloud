variable "aws_region" {
  description = "Regiao AWS onde o MVP sera publicado"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nome do projeto (usado em tags e no Name dos recursos)"
  type        = string
  default     = "guiding-hand"
}

variable "instance_type" {
  description = "Tipo da EC2 (t3.micro esta no free tier elegivel)"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Nome do Key Pair EC2 ja existente na AWS, para acesso SSH"
  type        = string
}

variable "admin_cidr" {
  description = "Seu IP publico em formato CIDR /32 (ex.: 200.198.10.5/32). Libera SSH, Prometheus e Grafana APENAS para voce. NUNCA use 0.0.0.0/0 aqui."
  type        = string

  validation {
    condition     = var.admin_cidr != "0.0.0.0/0"
    error_message = "admin_cidr nao pode ser 0.0.0.0/0: as portas de admin nunca podem ficar abertas para a internet."
  }
}

variable "repo_url" {
  description = "URL HTTPS do repositorio publico, usado pelo user_data para clonar e subir a stack"
  type        = string
  default     = "https://github.com/SEU_USUARIO/guiding-hand-cloud.git"
}
