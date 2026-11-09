# Relatório de Entrega — Guiding Hand (Cloud & DevSecOps)

> **Esqueleto do PDF de entrega.** Preencha, insira os prints indicados e exporte para **PDF único com links clicáveis** (o portal aceita PDF). Entrega: até **19/11/2026, 23h55**.

## 1. Identificação
- **Projeto:** Guiding Hand (CitizenTech)
- **Disciplina:** Secure DevOps Tools & Cloud Computing — "Deploy Blindado"
- **Equipe:** <nomes e RMs>
- **Repositório público:** <link do GitHub>
- **URL pública do MVP:** http://<IP-da-EC2>

## 2. Arquitetura
> Insira o diagrama (pode usar o `mermaid` do README renderizado, ou exportar como imagem).
- Descrição do fluxo: dev → GitHub Actions (segurança) → GHCR → deploy na EC2.
- Tabela de portas e exposição (ver README).

## 3. Container e IaC
- [ ] Print do `docker compose ps` com a stack de pé.
- [ ] Print do `terraform apply` concluído (outputs `app_url`, `grafana_url`).
- [ ] Print do Security Group mostrando 22/9090/3001 restritos ao nosso IP e 80 público.
- Evidência: Dockerfile não-root, sem segredo na imagem; state/.tfvars fora do repo.

## 4. Pipeline DevSecOps
- [ ] Print da execução **BARRADA** (vermelha) — ex.: Gitleaks pegando segredo fake.
- [ ] Print da execução **CORRIGIDA** (verde) — após remover o segredo.
- [ ] Print dos GitHub Secrets configurados (`EC2_HOST`, `EC2_SSH_KEY`).
- Descreva o que cada etapa faz (Gitleaks, Semgrep, Trivy, build, push, deploy).

## 5. Observabilidade
- [ ] Print do dashboard Grafana com as **4 métricas de ouro**.
- [ ] Print de um **alerta disparado** (Prometheus → Alerts FIRING, ou alerta no Grafana).
- Descreva as métricas e como o alerta foi disparado.

## 6. LGPD e Responsabilidade Compartilhada
- Onde ficam os dados pessoais e por que são sensíveis (ver README).
- Tabela de responsabilidade compartilhada AWS.

## 7. Estimativa de Custo
- Tabela de custo (Free Tier x pós Free Tier) — ver README.

## 8. Ficha Técnica e Reprodução
- Ficha Técnica (ver README).
- Passos para reproduzir localmente e na AWS.

## 9. Links
- Repositório: <link>
- URL do MVP: <link>
- Vídeo (se houver): <link>
