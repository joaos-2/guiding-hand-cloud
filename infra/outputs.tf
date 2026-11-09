output "public_ip" {
  description = "IP publico da EC2"
  value       = aws_instance.app.public_ip
}

output "app_url" {
  description = "URL publica do MVP (Guiding Hand)"
  value       = "http://${aws_instance.app.public_ip}"
}

output "grafana_url" {
  description = "Grafana (acessivel apenas do seu IP)"
  value       = "http://${aws_instance.app.public_ip}:3001"
}

output "prometheus_url" {
  description = "Prometheus (acessivel apenas do seu IP)"
  value       = "http://${aws_instance.app.public_ip}:9090"
}

output "ssh_command" {
  description = "Comando para acessar a EC2"
  value       = "ssh ec2-user@${aws_instance.app.public_ip}"
}
