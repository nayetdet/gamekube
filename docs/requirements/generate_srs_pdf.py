import os
import subprocess
import sys

def build_html_content():
    return """<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>GameKube - Documento de Especificação de Requisitos de Software</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  @page {
    size: A4 portrait;
    margin: 16mm 16mm 18mm 16mm;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #1e293b;
    line-height: 1.45;
    font-size: 9.5pt;
    background: #ffffff;
    margin: 0;
    padding: 0;
  }

  /* Capa */
  .cover-page {
    page-break-after: always;
    height: 92vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40mm 20mm 20mm 20mm;
    text-align: center;
    box-sizing: border-box;
  }

  .cover-header .institution {
    font-size: 11.5pt;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: 0.5px;
    margin-bottom: 25px;
    text-transform: uppercase;
  }

  .cover-header .authors {
    font-size: 10.5pt;
    font-weight: 500;
    color: #334155;
    line-height: 1.7;
  }

  .cover-body {
    margin: 30px 0;
  }

  .cover-title {
    font-size: 26pt;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
    margin-bottom: 12px;
    letter-spacing: -0.5px;
  }

  .cover-subtitle {
    font-size: 12.5pt;
    font-weight: 500;
    color: #475569;
    line-height: 1.4;
    margin-bottom: 25px;
  }

  .cover-tag {
    display: inline-block;
    background: #e0e7ff;
    color: #3730a3;
    font-weight: 700;
    font-size: 9.5pt;
    padding: 6px 18px;
    border-radius: 9999px;
    border: 1px solid #c7d2fe;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .cover-footer {
    font-size: 9pt;
    color: #64748b;
    line-height: 1.6;
    border-top: 1px solid #e2e8f0;
    padding-top: 18px;
  }

  /* Títulos */
  .page-break {
    page-break-after: always;
  }

  h1 {
    font-size: 15pt;
    font-weight: 800;
    color: #0f172a;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 5px;
    margin-top: 22px;
    margin-bottom: 12px;
    page-break-after: avoid;
    letter-spacing: -0.3px;
  }

  h2 {
    font-size: 11.5pt;
    font-weight: 700;
    color: #1e293b;
    margin-top: 16px;
    margin-bottom: 8px;
    page-break-after: avoid;
  }

  h3 {
    font-size: 10pt;
    font-weight: 600;
    color: #334155;
    margin-top: 12px;
    margin-bottom: 6px;
    page-break-after: avoid;
  }

  p {
    margin-top: 0;
    margin-bottom: 8px;
    text-align: justify;
  }

  ul, ol {
    margin-top: 0;
    margin-bottom: 10px;
    padding-left: 20px;
  }

  li {
    margin-bottom: 3px;
  }

  code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5pt;
    background-color: #f1f5f9;
    padding: 1px 4px;
    border-radius: 4px;
    color: #0f172a;
    border: 1px solid #e2e8f0;
  }

  /* Tabelas */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
    margin-bottom: 14px;
    font-size: 8.5pt;
    page-break-inside: avoid;
  }

  th, td {
    border: 1px solid #cbd5e1;
    padding: 6px 9px;
    text-align: left;
    vertical-align: top;
  }

  th {
    background-color: #f8fafc;
    color: #0f172a;
    font-weight: 700;
    border-bottom: 2px solid #94a3b8;
  }

  tr:nth-child(even) {
    background-color: #fdfdfd;
  }

  /* Badges */
  .badge {
    display: inline-block;
    padding: 2px 6px;
    font-size: 7.2pt;
    font-weight: 700;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  .badge-must {
    background-color: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }

  .badge-should {
    background-color: #fef3c7;
    color: #92400e;
    border: 1px solid #fde68a;
  }

  /* Cartões de Requisito */
  .req-card {
    border: 1px solid #e2e8f0;
    border-left: 3.5px solid #2563eb;
    background-color: #f8fafc;
    border-radius: 5px;
    padding: 8px 11px;
    margin-bottom: 9px;
    page-break-inside: avoid;
  }

  .req-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  .req-id {
    font-weight: 800;
    color: #1d4ed8;
    font-size: 9.5pt;
  }

  .req-title {
    font-weight: 700;
    color: #0f172a;
    font-size: 9.5pt;
    margin-left: 6px;
  }

  .req-desc {
    color: #334155;
    font-size: 8.8pt;
    margin-bottom: 4px;
    text-align: justify;
  }

  .req-meta {
    font-size: 8.2pt;
    color: #64748b;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 5px 8px;
    margin-top: 4px;
  }

  .req-meta strong {
    color: #475569;
  }

  /* Sumário */
  .toc {
    list-style: none;
    padding-left: 0;
    margin-top: 10px;
  }

  .toc-item {
    display: flex;
    justify-content: space-between;
    padding: 4.5px 0;
    border-bottom: 1px dotted #cbd5e1;
    font-size: 9pt;
  }

  .toc-item.level-1 {
    font-weight: 700;
    color: #0f172a;
    margin-top: 5px;
    border-bottom: 1px solid #94a3b8;
  }

  .toc-item.level-2 {
    padding-left: 14px;
    color: #334155;
  }

  /* Diagrama */
  .diagram-container {
    text-align: center;
    margin: 12px 0;
    padding: 10px;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    page-break-inside: avoid;
  }

  .diagram-caption {
    font-size: 8.2pt;
    color: #64748b;
    margin-top: 6px;
    font-style: italic;
  }
</style>
</head>
<body>

<!-- CAPA -->
<div class="cover-page">
  <div class="cover-header">
    <div class="institution">Instituto Federal do Ceará (IFCE) &bull; Disciplina de Análise e Projeto de Sistemas (APS)</div>
    <div class="authors">
      <strong>Amanda Cavalcante Vieira</strong><br>
      <strong>Isaac da Cunha Cavalcanti Duarte</strong><br>
      <strong>João Pedro Moreira Campos de Lima</strong><br>
      <strong>Rodrigo Sousa Sales</strong>
    </div>
  </div>

  <div class="cover-body">
    <div class="cover-title">GameKube</div>
    <div class="cover-subtitle">Plataforma Web para Execução de Jogos em Contêineres Orquestrados por Kubernetes</div>
    <div class="cover-tag">Especificação de Requisitos de Software (SRS)</div>
  </div>

  <div class="cover-footer">
    Documento elaborado conforme as diretrizes simplificadas da norma IEEE 830.<br>
    Referência: Semestre 2026.2 &bull; Setembro de 2026
  </div>
</div>

<!-- 1. SUMÁRIO -->
<h1>1. Sumário</h1>
<ul class="toc">
  <li class="toc-item level-1"><span>1. Sumário</span><span>2</span></li>
  <li class="toc-item level-1"><span>2. Introdução</span><span>3</span></li>
  <li class="toc-item level-2"><span>2.1 Finalidade do Documento</span><span>3</span></li>
  <li class="toc-item level-2"><span>2.2 Escopo do Projeto</span><span>3</span></li>
  <li class="toc-item level-2"><span>2.3 Definições, Acrônimos e Abreviações</span><span>3</span></li>
  <li class="toc-item level-2"><span>2.4 Visão Geral da Arquitetura e Tecnologias</span><span>4</span></li>
  <li class="toc-item level-1"><span>3. Modelo de Casos de Uso (UML)</span><span>5</span></li>
  <li class="toc-item level-2"><span>3.1 Atores do Sistema</span><span>5</span></li>
  <li class="toc-item level-2"><span>3.2 Diagrama Geral de Casos de Uso</span><span>5</span></li>
  <li class="toc-item level-2"><span>3.3 Especificação dos Casos de Uso Principais</span><span>6</span></li>
  <li class="toc-item level-1"><span>4. Requisitos Funcionais</span><span>7</span></li>
  <li class="toc-item level-2"><span>4.1 Módulo de Autenticação e Gestão de Identidade</span><span>7</span></li>
  <li class="toc-item level-2"><span>4.2 Módulo de Gestão de Contas e Perfis de Usuário</span><span>8</span></li>
  <li class="toc-item level-2"><span>4.3 Módulo de Catálogo e Execução de Jogos Sob Demanda</span><span>9</span></li>
  <li class="toc-item level-2"><span>4.4 Módulo Social (Amizades e Diretório)</span><span>10</span></li>
  <li class="toc-item level-2"><span>4.5 Módulo de Presença em Tempo Real e Mensageria</span><span>11</span></li>
  <li class="toc-item level-2"><span>4.6 Matriz de Resumo e Priorização (MoSCoW)</span><span>12</span></li>
  <li class="toc-item level-1"><span>5. Requisitos Não-Funcionais</span><span>13</span></li>
  <li class="toc-item level-2"><span>5.1 Desempenho e Eficiência</span><span>13</span></li>
  <li class="toc-item level-2"><span>5.2 Segurança e Privacidade</span><span>13</span></li>
  <li class="toc-item level-2"><span>5.3 Confiabilidade, Disponibilidade e Tolerância a Falhas</span><span>14</span></li>
  <li class="toc-item level-2"><span>5.4 Usabilidade e Acessibilidade</span><span>14</span></li>
  <li class="toc-item level-2"><span>5.5 Portabilidade e Manutenibilidade da Infraestrutura</span><span>15</span></li>
  <li class="toc-item level-2"><span>5.6 Matriz de Resumo dos Requisitos Não-Funcionais</span><span>15</span></li>
</ul>

<div class="page-break"></div>

<!-- 2. INTRODUÇÃO -->
<h1>2. Introdução</h1>

<h2>2.1 Finalidade do Documento</h2>
<p>
Este documento apresenta a <strong>Especificação de Requisitos de Software (SRS - Software Requirements Specification)</strong> para a plataforma <strong>GameKube</strong>. O propósito é definir de forma clara e verificável os serviços (requisitos funcionais) e as restrições operacionais e arquiteturais (requisitos não-funcionais) do sistema, servindo como guia oficial para o ciclo de desenvolvimento, testes e homologação na disciplina de Análise e Projeto de Sistemas (APS - 2026.2).
</p>

<h2>2.2 Escopo do Projeto</h2>
<p>
O <strong>GameKube</strong> é uma plataforma web para execução de jogos em contêineres orquestrados por Kubernetes. A aplicação elimina as barreiras clássicas do modelo tradicional de jogos (instalação manual, compatibilidade com sistemas operacionais e exigências pesadas de hardware do cliente), permitindo que jogadores autenticados iniciem instâncias de jogos diretamente no navegador com isolamento estrito de recursos.
</p>
<p>O escopo abrange quatro pilares centrais:</p>
<ul>
  <li><strong>Execução de Jogos Sob Demanda:</strong> Criação dinâmica de Pods, Services, Ingress TLS e OAuth2-Proxy no Kubernetes com encerramento automático por ociosidade (idle timeout);</li>
  <li><strong>Camada Social e Comunidade:</strong> Diretório de jogadores com busca paginada, sistema bilateral de amizades (solicitar, aceitar, recusar e remover) e chat em tempo real via STOMP/WebSocket;</li>
  <li><strong>Presença em Tempo Real:</strong> Controle de status (Online, Ocupado, Ausente, Offline) e indicação do jogo em execução;</li>
  <li><strong>Identidade e Segurança:</strong> Autenticação centralizada com Keycloak (OIDC/PKCE) e controle de acesso baseado em papéis (RBAC).</li>
</ul>

<h2>2.3 Definições, Acrônimos e Abreviações</h2>
<table>
  <thead>
    <tr>
      <th style="width: 24%;">Termo / Acrônimo</th>
      <th>Definição</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><strong>APS</strong></td><td>Análise e Projeto de Sistemas.</td></tr>
    <tr><td><strong>SRS / ERS</strong></td><td>Software Requirements Specification (Especificação de Requisitos de Software).</td></tr>
    <tr><td><strong>Kubernetes (K8s)</strong></td><td>Orquestrador de contêineres para automação de implantação, escalabilidade e gerenciamento.</td></tr>
    <tr><td><strong>Pod</strong></td><td>Menor unidade de computação no K8s, encapsulando os contêineres de cada sessão de jogo.</td></tr>
    <tr><td><strong>Keycloak / OIDC</strong></td><td>Servidor de identidade e acesso utilizando OpenID Connect sobre OAuth 2.0 com fluxo PKCE.</td></tr>
    <tr><td><strong>STOMP</strong></td><td>Simple Text Oriented Messaging Protocol; protocolo de mensagens sobre conexões WebSocket.</td></tr>
    <tr><td><strong>Idle Timeout</strong></td><td>Mecanismo de coleta e destruição automática de sessões inativas (5 minutos sem heartbeat).</td></tr>
    <tr><td><strong>MoSCoW</strong></td><td>Método de priorização: <em>Must have</em> (Obrigatório), <em>Should have</em> (Importante), <em>Could have</em> (Desejável).</td></tr>
  </tbody>
</table>

<h2>2.4 Visão Geral da Arquitetura e Tecnologias</h2>
<table>
  <thead>
    <tr>
      <th style="width: 22%;">Camada</th>
      <th style="width: 28%;">Tecnologias</th>
      <th>Papel no Sistema</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Frontend (Web)</strong></td>
      <td>Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Radix UI</td>
      <td>Interface gráfica responsiva, catálogo, terminal de jogo (game stage) e chat social.</td>
    </tr>
    <tr>
      <td><strong>Backend (Aplicação)</strong></td>
      <td>Java 21/25, Spring Boot 4.1, Spring Security, Spring STOMP, Fabric8 K8s</td>
      <td>Regras de negócio, orquestração de pods no K8s, controle de amizades e agendador.</td>
    </tr>
    <tr>
      <td><strong>Identidade (IAM)</strong></td>
      <td>Keycloak 25/26 (OpenID Connect / OAuth 2.0)</td>
      <td>Autenticação centralizada, emissão de tokens JWT e gestão de credenciais.</td>
    </tr>
    <tr>
      <td><strong>Banco de Dados</strong></td>
      <td>PostgreSQL 16/18, Flyway Migration</td>
      <td>Persistência relacional de usuários, solicitações de amizade e histórico de mensagens.</td>
    </tr>
    <tr>
      <td><strong>Cache e Presença</strong></td>
      <td>Redis 7/8</td>
      <td>Armazenamento em memória para estados de presença e cache de catálogo de jogos.</td>
    </tr>
    <tr>
      <td><strong>Orquestração / Infra</strong></td>
      <td>Kubernetes, Helm, Traefik Ingress, Cert-Manager</td>
      <td>Provisionamento dinâmico de instâncias, roteamento seguro e certificados TLS.</td>
    </tr>
  </tbody>
</table>

<div class="page-break"></div>

<!-- 3. CASOS DE USO -->
<h1>3. Modelo de Casos de Uso (UML)</h1>

<h2>3.1 Atores do Sistema</h2>
<ul>
  <li><strong>Visitante:</strong> Usuário não autenticado que acessa a landing page e pode realizar login ou cadastro;</li>
  <li><strong>Jogador:</strong> Usuário autenticado que navega pelo catálogo, joga partidas sob demanda, interage socialmente com amigos e configura sua conta;</li>
  <li><strong>Orquestrador Kubernetes:</strong> Ator autônomo que instancia, monitora via probes de prontidão e destrói contêineres de jogos;</li>
  <li><strong>Administrador:</strong> Usuário com privilégios para telemetria e gestão do catálogo de jogos.</li>
</ul>

<h2>3.2 Diagrama Geral de Casos de Uso</h2>
<div class="diagram-container">
  <svg width="670" height="370" viewBox="0 0 670 370" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
    <defs>
      <linearGradient id="boxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#f8fafc"/>
      </linearGradient>
    </defs>

    <!-- Limite do Sistema -->
    <rect x="140" y="10" width="390" height="350" rx="8" fill="url(#boxGrad)" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4 2"/>
    <text x="335" y="28" font-family="Inter, sans-serif" font-size="10.5" font-weight="700" fill="#0f172a" text-anchor="middle">Sistema GameKube</text>

    <!-- Ator: Jogador -->
    <g transform="translate(45, 120)">
      <circle cx="20" cy="15" r="9" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5"/>
      <line x1="20" y1="24" x2="20" y2="48" stroke="#1d4ed8" stroke-width="2"/>
      <line x1="5" y1="33" x2="35" y2="33" stroke="#1d4ed8" stroke-width="2"/>
      <line x1="20" y1="48" x2="8" y2="66" stroke="#1d4ed8" stroke-width="2"/>
      <line x1="20" y1="48" x2="32" y2="66" stroke="#1d4ed8" stroke-width="2"/>
      <text x="20" y="82" font-family="Inter, sans-serif" font-size="9.5" font-weight="700" fill="#0f172a" text-anchor="middle">Jogador</text>
      <text x="20" y="93" font-family="Inter, sans-serif" font-size="7.5" fill="#64748b" text-anchor="middle">(Autenticado)</text>
    </g>

    <!-- Ator: Visitante -->
    <g transform="translate(45, 20)">
      <circle cx="20" cy="12" r="7.5" fill="#94a3b8" stroke="#475569" stroke-width="1.5"/>
      <line x1="20" y1="19.5" x2="20" y2="38" stroke="#475569" stroke-width="1.5"/>
      <line x1="8" y1="26" x2="32" y2="26" stroke="#475569" stroke-width="1.5"/>
      <line x1="20" y1="38" x2="10" y2="52" stroke="#475569" stroke-width="1.5"/>
      <line x1="20" y1="38" x2="30" y2="52" stroke="#475569" stroke-width="1.5"/>
      <text x="20" y="64" font-family="Inter, sans-serif" font-size="8.5" font-weight="600" fill="#334155" text-anchor="middle">Visitante</text>
    </g>

    <!-- Ator: Kubernetes -->
    <g transform="translate(565, 145)">
      <rect x="0" y="10" width="70" height="38" rx="4" fill="#e0e7ff" stroke="#4338ca" stroke-width="1.5"/>
      <text x="35" y="26" font-family="Inter, sans-serif" font-size="7.5" font-weight="700" fill="#3730a3" text-anchor="middle">&lt;&lt;System&gt;&gt;</text>
      <text x="35" y="39" font-family="Inter, sans-serif" font-size="8.5" font-weight="700" fill="#1e1b4b" text-anchor="middle">Kubernetes</text>
    </g>

    <!-- Casos de Uso -->
    <g transform="translate(175, 40)">
      <ellipse cx="70" cy="14" rx="65" ry="14" fill="#ffffff" stroke="#2563eb" stroke-width="1.2"/>
      <text x="70" y="18" font-family="Inter, sans-serif" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">UC01: Autenticar / Logout</text>
    </g>

    <g transform="translate(175, 75)">
      <ellipse cx="70" cy="14" rx="65" ry="14" fill="#ffffff" stroke="#2563eb" stroke-width="1.2"/>
      <text x="70" y="18" font-family="Inter, sans-serif" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">UC02: Consultar Catálogo</text>
    </g>

    <g transform="translate(175, 110)">
      <ellipse cx="80" cy="16" rx="75" ry="16" fill="#eff6ff" stroke="#1d4ed8" stroke-width="1.5"/>
      <text x="80" y="20" font-family="Inter, sans-serif" font-size="8" font-weight="700" fill="#1e40af" text-anchor="middle">UC03: Iniciar Sessão de Jogo</text>
    </g>

    <g transform="translate(350, 110)">
      <ellipse cx="70" cy="16" rx="65" ry="16" fill="#ffffff" stroke="#059669" stroke-width="1.2" stroke-dasharray="3 2"/>
      <text x="70" y="20" font-family="Inter, sans-serif" font-size="7.5" font-weight="500" fill="#065f46" text-anchor="middle">&lt;&lt;include&gt;&gt; UC04: Heartbeat</text>
    </g>

    <g transform="translate(250, 155)">
      <ellipse cx="75" cy="15" rx="70" ry="15" fill="#ffffff" stroke="#dc2626" stroke-width="1.2"/>
      <text x="75" y="19" font-family="Inter, sans-serif" font-size="8" font-weight="600" fill="#991b1b" text-anchor="middle">UC05: Encerrar Instância</text>
    </g>

    <g transform="translate(175, 195)">
      <ellipse cx="75" cy="14" rx="70" ry="14" fill="#ffffff" stroke="#2563eb" stroke-width="1.2"/>
      <text x="75" y="18" font-family="Inter, sans-serif" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">UC06: Gerenciar Amizades</text>
    </g>

    <g transform="translate(175, 230)">
      <ellipse cx="75" cy="14" rx="70" ry="14" fill="#ffffff" stroke="#2563eb" stroke-width="1.2"/>
      <text x="75" y="18" font-family="Inter, sans-serif" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">UC07: Buscar Jogadores</text>
    </g>

    <g transform="translate(175, 265)">
      <ellipse cx="75" cy="14" rx="70" ry="14" fill="#ffffff" stroke="#2563eb" stroke-width="1.2"/>
      <text x="75" y="18" font-family="Inter, sans-serif" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">UC08: Atualizar Presença</text>
    </g>

    <g transform="translate(175, 300)">
      <ellipse cx="75" cy="14" rx="70" ry="14" fill="#ffffff" stroke="#2563eb" stroke-width="1.2"/>
      <text x="75" y="18" font-family="Inter, sans-serif" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">UC09: Chat em Tempo Real</text>
    </g>

    <g transform="translate(350, 265)">
      <ellipse cx="70" cy="14" rx="65" ry="14" fill="#ffffff" stroke="#2563eb" stroke-width="1.2"/>
      <text x="70" y="18" font-family="Inter, sans-serif" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">UC10: Gerenciar Conta</text>
    </g>

    <!-- Linhas -->
    <line x1="75" y1="38" x2="175" y2="52" stroke="#64748b" stroke-width="1.2"/>
    <line x1="85" y1="145" x2="175" y2="54" stroke="#2563eb" stroke-width="1.2"/>
    <line x1="85" y1="150" x2="175" y2="89" stroke="#2563eb" stroke-width="1.2"/>
    <line x1="85" y1="155" x2="175" y2="126" stroke="#2563eb" stroke-width="1.5"/>
    <line x1="85" y1="160" x2="250" y2="170" stroke="#2563eb" stroke-width="1.2"/>
    <line x1="85" y1="165" x2="175" y2="209" stroke="#2563eb" stroke-width="1.2"/>
    <line x1="85" y1="170" x2="175" y2="244" stroke="#2563eb" stroke-width="1.2"/>
    <line x1="85" y1="175" x2="175" y2="279" stroke="#2563eb" stroke-width="1.2"/>
    <line x1="85" y1="180" x2="175" y2="314" stroke="#2563eb" stroke-width="1.2"/>
    <line x1="85" y1="185" x2="350" y2="279" stroke="#2563eb" stroke-width="1.2"/>

    <line x1="330" y1="126" x2="350" y2="126" stroke="#059669" stroke-width="1.2" stroke-dasharray="3 3"/>
    <line x1="330" y1="120" x2="565" y2="160" stroke="#4338ca" stroke-width="1.2"/>
    <line x1="395" y1="170" x2="565" y2="168" stroke="#dc2626" stroke-width="1.2"/>
  </svg>
  <div class="diagram-caption">Figura 1: Diagrama Geral de Casos de Uso do Sistema GameKube (UML).</div>
</div>

<h2>3.3 Especificação dos Casos de Uso Principais</h2>
<table>
  <thead>
    <tr>
      <th style="width: 25%;">Caso de Uso</th>
      <th>Descrição e Fluxos</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>UC01: Autenticar / Logout</strong></td>
      <td>
        <strong>Atores:</strong> Visitante, Jogador, Keycloak.<br>
        <strong>Fluxo:</strong> Redirecionamento com desafio PKCE, autenticação no Keycloak, emissão de tokens JWT e cookie cifrado. Ao deslogar, invalidação de sessão e presença <code>OFFLINE</code>.
      </td>
    </tr>
    <tr>
      <td><strong>UC03: Iniciar Sessão de Jogo</strong></td>
      <td>
        <strong>Atores:</strong> Jogador, Orquestrador Kubernetes.<br>
        <strong>Fluxo:</strong> O jogador escolhe um título; o backend cria Deployment, Service, Ingress e Secret TLS no K8s; aguarda <em>readiness probes</em> e entrega URL segura para o <em>Game Stage</em>.
      </td>
    </tr>
    <tr>
      <td><strong>UC04: Manter Heartbeat / Limpeza</strong></td>
      <td>
        <strong>Atores:</strong> Jogador (Frontend), Agendador (Backend), Kubernetes.<br>
        <strong>Fluxo:</strong> Envio de pulso a cada 15s. Ausência de pulso por 5 min (idle timeout) aciona a destruição automática do Pod no cluster.
      </td>
    </tr>
    <tr>
      <td><strong>UC06: Gerenciar Amizades</strong></td>
      <td>
        <strong>Atores:</strong> Jogadores.<br>
        <strong>Fluxo:</strong> Envio de solicitação bilateral, notificações de pendência, aceite via PATCH ou recusa, e listagem em tempo real.
      </td>
    </tr>
    <tr>
      <td><strong>UC08: Atualizar Presença</strong></td>
      <td>
        <strong>Atores:</strong> Jogador, Redis, WebSocket.<br>
        <strong>Fluxo:</strong> Jogador altera status (Online, Busy, Away, Offline). Atualização no Redis e disparo imediato via STOMP para a lista de amigos.
      </td>
    </tr>
  </tbody>
</table>

<div class="page-break"></div>

<!-- 4. REQUISITOS FUNCIONAIS -->
<h1>4. Requisitos Funcionais</h1>

<h2>4.1 Módulo de Autenticação e Gestão de Identidade</h2>
<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RF01</span><span class="req-title">Autenticação Centralizada e SSO (OIDC/PKCE)</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">O sistema deve autenticar usuários centralizadamente com OpenID Connect (OIDC) e fluxo PKCE via Keycloak, emitindo tokens JWT e cookies de sessão criptografados.</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RF02</span><span class="req-title">Cadastro de Nova Conta de Usuário</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">O sistema deve permitir o autorregistro com nome de usuário único, e-mail válido, nome completo e senha protegida.</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RF03</span><span class="req-title">Controle de Acesso Baseado em Papéis (RBAC)</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">O sistema deve restringir operações e rotas através de anotações de autorização (<code>@PreAuthorizeUser</code> e <code>@PreAuthorizeAdmin</code>).</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RF04</span><span class="req-title">Encerramento Seguro de Sessão (Logout)</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">O sistema deve revogar tokens, limpar cookies de sessão e alterar a presença do usuário para <code>OFFLINE</code> no encerramento.</div>
</div>

<h2>4.2 Módulo de Gestão de Contas e Perfis de Usuário</h2>
<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RF05</span><span class="req-title">Visualização e Edição de Perfil Pessoal</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">O usuário autenticado pode consultar e atualizar seus próprios dados de perfil (nome, bio, preferências visuais).</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RF06</span><span class="req-title">Alteração de E-mail com Reautenticação</span></div>
    <span class="badge badge-should">Should Have</span>
  </div>
  <div class="req-desc">Permite a alteração do endereço de e-mail mediante confirmação da senha atual.</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RF07</span><span class="req-title">Exclusão Permanente de Conta (LGPD)</span></div>
    <span class="badge badge-should">Should Have</span>
  </div>
  <div class="req-desc">Permite a remoção definitiva da conta, limpando credenciais, presenças e histórico associado.</div>
</div>

<h2>4.3 Módulo de Catálogo e Execução de Jogos Sob Demanda</h2>
<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RF08</span><span class="req-title">Consulta ao Catálogo de Jogos</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">Exibição de jogos disponíveis com capa, sinopse, gênero, controles e requisitos técnicos cacheados no Redis.</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RF09</span><span class="req-title">Provisionamento Dinâmico de Instância K8s</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">Criação sob demanda de Deployment, Service, Ingress e autenticação OAuth2-Proxy isolada por partida.</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RF10</span><span class="req-title">Acompanhamento de Prontidão (Readiness Probes)</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">Monitoramento do Pod no K8s até estar apto a receber conexões (timeout configurado para 5 minutos).</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RF11</span><span class="req-title">Ambiente de Execução Embutido (Game Stage)</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">Interface dedicada (<code>/play/[slug]</code>) com toolbar, modo tela cheia, indicadores de status e controle de sessão.</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RF12</span><span class="req-title">Monitoramento de Heartbeat e Idle Cleanup</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">Emissão periódica de pulso de atividade (15s) e destruição automática de pods ociosos após 5 minutos.</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RF13</span><span class="req-title">Encerramento Manual de Instância</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">Botão para encerrar a partida imediatamente e desalocar os recursos no Kubernetes.</div>
</div>

<div class="page-break"></div>

<h2>4.4 Módulo Social (Amizades e Diretório)</h2>
<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RF14</span><span class="req-title">Diretório de Jogadores Paginado</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">Listagem e busca de jogadores cadastrados com suporte a filtros e paginação.</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RF15</span><span class="req-title">Envio de Solicitações de Amizade</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">Envio de pedidos de amizade bilaterais com validação contra duplicações.</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RF16</span><span class="req-title">Gestão de Solicitações (Aceitar/Recusar)</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">Painel separado para responder pedidos recebidos (aceite via PATCH / recusa) e acompanhar enviados.</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RF17</span><span class="req-title">Desfazimento de Vínculo de Amizade</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">Opção de remover amizades existentes a qualquer momento por qualquer das partes.</div>
</div>

<h2>4.5 Módulo de Presença em Tempo Real e Mensageria</h2>
<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RF18</span><span class="req-title">Controle e Publicação de Presença</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">Definição de status (<code>ONLINE</code>, <code>BUSY</code>, <code>AWAY</code>, <code>OFFLINE</code>) com difusão instantânea via STOMP/Redis.</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RF19</span><span class="req-title">Indicação Automática de Jogo Ativo</span></div>
    <span class="badge badge-should">Should Have</span>
  </div>
  <div class="req-desc">Atualização automática do perfil ao jogar (ex: "Jogando Cave Story"), visível aos amigos.</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RF20</span><span class="req-title">Chat 1-para-1 em Tempo Real via WebSocket</span></div>
    <span class="badge badge-should">Should Have</span>
  </div>
  <div class="req-desc">Troca de mensagens de texto privadas entre amigos com persistência relacional e confirmação de leitura.</div>
</div>

<h2>4.6 Matriz de Resumo e Priorização (MoSCoW)</h2>
<table>
  <thead>
    <tr>
      <th style="width: 10%;">ID</th>
      <th style="width: 40%;">Nome do Requisito</th>
      <th style="width: 25%;">Módulo</th>
      <th style="width: 15%;">Prioridade</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><strong>RF01</strong></td><td>Autenticação Centralizada (OIDC/PKCE)</td><td>Identidade</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RF02</strong></td><td>Cadastro de Nova Conta</td><td>Identidade</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RF03</strong></td><td>Controle de Acesso RBAC</td><td>Identidade</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RF04</strong></td><td>Encerramento Seguro (Logout)</td><td>Identidade</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RF05</strong></td><td>Visualização e Edição de Perfil</td><td>Gestão de Contas</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RF06</strong></td><td>Alteração de E-mail</td><td>Gestão de Contas</td><td><span class="badge badge-should">Should Have</span></td></tr>
    <tr><td><strong>RF07</strong></td><td>Exclusão Permanente de Conta</td><td>Gestão de Contas</td><td><span class="badge badge-should">Should Have</span></td></tr>
    <tr><td><strong>RF08</strong></td><td>Consulta ao Catálogo de Jogos</td><td>Jogos Sob Demanda</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RF09</strong></td><td>Provisionamento Dinâmico K8s</td><td>Jogos Sob Demanda</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RF10</strong></td><td>Acompanhamento de Prontidão (Probes)</td><td>Jogos Sob Demanda</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RF11</strong></td><td>Game Stage (Execução Embutida)</td><td>Jogos Sob Demanda</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RF12</strong></td><td>Heartbeat e Idle Cleanup</td><td>Jogos Sob Demanda</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RF13</strong></td><td>Encerramento Manual de Instância</td><td>Jogos Sob Demanda</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RF14</strong></td><td>Diretório de Jogadores Paginado</td><td>Rede Social</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RF15</strong></td><td>Envio de Solicitações de Amizade</td><td>Rede Social</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RF16</strong></td><td>Gestão de Solicitações Recebidas/Enviadas</td><td>Rede Social</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RF17</strong></td><td>Desfazimento de Amizade</td><td>Rede Social</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RF18</strong></td><td>Controle e Publicação de Presença</td><td>Tempo Real</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RF19</strong></td><td>Indicação Automática de Jogo Ativo</td><td>Tempo Real</td><td><span class="badge badge-should">Should Have</span></td></tr>
    <tr><td><strong>RF20</strong></td><td>Chat Privado via WebSocket</td><td>Tempo Real</td><td><span class="badge badge-should">Should Have</span></td></tr>
  </tbody>
</table>

<div class="page-break"></div>

<!-- 5. REQUISITOS NÃO-FUNCIONAIS -->
<h1>5. Requisitos Não-Funcionais</h1>

<h2>5.1 Desempenho e Eficiência</h2>
<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RNF01</span><span class="req-title">Tempo de Inicialização de Jogo</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">O tempo entre o clique do usuário e o carregamento do jogo no navegador não deve ultrapassar <strong>10 segundos</strong> com imagens em cache no cluster local.</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RNF02</span><span class="req-title">Tempo de Resposta das APIs REST</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">O tempo de resposta no percentil 95 (p95) para consultas de catálogo, amizades e diretório deve ser inferior a <strong>200ms</strong>.</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RNF03</span><span class="req-title">Latência na Propagação de Presença</span></div>
    <span class="badge badge-should">Should Have</span>
  </div>
  <div class="req-desc">Eventos de presença e status de jogo via WebSocket/Redis devem ser entregues aos clientes conectados em menos de <strong>500ms</strong>.</div>
</div>

<h2>5.2 Segurança e Privacidade</h2>
<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RNF04</span><span class="req-title">Comunicação Cifrada Ponta a Ponta (TLS)</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">100% do tráfego (HTTP, WebSocket e instâncias de jogos) deve utilizar HTTPS/WSS com certificados emitidos automaticamente pelo <code>Cert-Manager</code>.</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RNF05</span><span class="req-title">Isolamento e Proteção OIDC por Instância</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">Cada instância de jogo deve conter um proxy OIDC (OAuth2-Proxy), garantindo que apenas o usuário solicitante acesse a URL da sessão.</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RNF06</span><span class="req-title">Proteção contra Ameaças Web (OWASP Top 10)</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">Mitigação de vulnerabilidades XSS, CSRF, injeção de comandos e proteção de cookies (<code>HttpOnly</code>, <code>SameSite=Lax</code>, <code>Secure</code>).</div>
</div>

<h2>5.3 Confiabilidade, Disponibilidade e Tolerância a Falhas</h2>
<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RNF07</span><span class="req-title">Autocura de Contêineres (Self-Healing)</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">O Kubernetes deve monitorar os pods via <em>Liveness</em> e <em>Readiness Probes</em>, reiniciando contêineres que entrem em falha.</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RNF08</span><span class="req-title">Isolamento e Statelessness das Partidas</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">Instâncias de jogo devem ser descartáveis; a queda de uma sessão individual não pode afetar outras partidas ou a plataforma central.</div>
</div>

<h2>5.4 Usabilidade e Acessibilidade</h2>
<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RNF09</span><span class="req-title">Design Responsivo Multidispositivo</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">A interface deve se adaptar com fidelidade desde smartphones (360px) até monitores desktop e ultra-wide (4K).</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RNF10</span><span class="req-title">Feedback Visual e Loading States</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">Todas as operações assíncronas devem apresentar esqueletos (skeletons), indicadores de progresso ou spinners animados.</div>
</div>

<h2>5.5 Portabilidade e Manutenibilidade da Infraestrutura</h2>
<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RNF11</span><span class="req-title">Infraestrutura como Código (IaC) e Reprodutibilidade</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">Toda a infraestrutura (Kind, Helm, Traefik, Keycloak, Postgres, Redis) deve ser reprodutível via <code>Makefiles</code> do repositório.</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RNF12</span><span class="req-title">Documentação Interativa de APIs (Swagger UI)</span></div>
    <span class="badge badge-should">Should Have</span>
  </div>
  <div class="req-desc">Endpoints REST devem ser documentados e testáveis pelo Swagger UI do SpringDoc OpenAPI em <code>/swagger-ui.html</code>.</div>
</div>

<div class="req-card">
  <div class="req-header">
    <div><span class="req-id">RNF13</span><span class="req-title">Conformidade Arquitetural (ArchUnit)</span></div>
    <span class="badge badge-must">Must Have</span>
  </div>
  <div class="req-desc">O backend deve passar nas validações automáticas de camadas arquiteturais do ArchUnit durante a fase de testes (<code>gradle check</code>).</div>
</div>

<h2>5.6 Matriz de Resumo dos Requisitos Não-Funcionais</h2>
<table>
  <thead>
    <tr>
      <th style="width: 10%;">ID</th>
      <th style="width: 32%;">Requisito Não-Funcional</th>
      <th style="width: 25%;">Categoria ISO 25010</th>
      <th style="width: 18%;">Critério de Aceitação</th>
      <th style="width: 15%;">Prioridade</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><strong>RNF01</strong></td><td>Tempo de Inicialização de Jogo</td><td>Desempenho</td><td>&le; 10s no cluster</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RNF02</strong></td><td>Tempo de Resposta REST</td><td>Desempenho</td><td>p95 &le; 200ms</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RNF03</strong></td><td>Latência de Presença (STOMP)</td><td>Desempenho</td><td>&le; 500ms</td><td><span class="badge badge-should">Should Have</span></td></tr>
    <tr><td><strong>RNF04</strong></td><td>Comunicação Cifrada (TLS)</td><td>Segurança</td><td>100% HTTPS/WSS</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RNF05</strong></td><td>Isolamento OIDC por Partida</td><td>Segurança</td><td>OAuth2-Proxy por Pod</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RNF06</strong></td><td>Mitigações OWASP</td><td>Segurança</td><td>Cookies e Sanitização</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RNF07</strong></td><td>Autocura e Probes K8s</td><td>Confiabilidade</td><td>Liveness/Readiness</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RNF08</strong></td><td>Statelessness das Partidas</td><td>Confiabilidade</td><td>Isolamento total</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RNF09</strong></td><td>Responsividade Multidispositivo</td><td>Usabilidade</td><td>360px a 4K</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RNF10</strong></td><td>Feedback e Loading States</td><td>Usabilidade</td><td>Skeletons/Spinners</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RNF11</strong></td><td>Automação de Infraestrutura</td><td>Manutenibilidade</td><td>Makefile + Helm 100%</td><td><span class="badge badge-must">Must Have</span></td></tr>
    <tr><td><strong>RNF12</strong></td><td>Documentação Swagger UI</td><td>Manutenibilidade</td><td>Swagger UI ativo</td><td><span class="badge badge-should">Should Have</span></td></tr>
    <tr><td><strong>RNF13</strong></td><td>Regras ArchUnit</td><td>Manutenibilidade</td><td>Passar no Gradle check</td><td><span class="badge badge-must">Must Have</span></td></tr>
  </tbody>
</table>

</body>
</html>
"""

def generate_pdf():
    html_content = build_html_content()
    html_file = "docs/requirements/documento_requisitos.html"
    pdf_file = "docs/requirements/Documento_de_Requisitos_GameKube.pdf"
    
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html_content)
        
    chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    cmd = [
        chrome_path,
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--no-pdf-header-footer",
        f"--print-to-pdf={os.path.abspath(pdf_file)}",
        os.path.abspath(html_file)
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Erro: {result.stderr}")
        sys.exit(1)
    
    print(f"PDF gerado com sucesso em: {pdf_file}")

if __name__ == "__main__":
    generate_pdf()
