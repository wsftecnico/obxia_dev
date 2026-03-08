# Checklist Beta - FVVN

## 1) Go/No-Go tecnico (obrigatorio)
- [ ] Sem erros visuais graves em Chrome, Safari e Firefox (desktop e mobile).
- [ ] Menu mobile, slider, CTA de inscricao e botao "Como chegar" funcionando.
- [ ] Todos os links externos abrindo corretamente (Google Forms, regulamento, redes).
- [ ] Todas as imagens carregando sem erro (exceto eventuais bloqueios de rede local).
- [ ] Google Analytics ativo (tag `G-B737WRC0F6`) e evento de pageview confirmado.

## 2) SEO e descoberta (obrigatorio)
- [ ] `canonical` apontando para `https://www.fvvn.com.br/`.
- [ ] `og:url`, `og:image`, `twitter:card` e descricao revisados.
- [ ] `robots` configurado com indexacao habilitada.
- [ ] Schema `Event` valido (data, local, organizador e URL corretos).

## 3) Conteudo e confianca (obrigatorio)
- [ ] Data e horario oficiais revisados com a organizacao.
- [ ] Endereco e contatos (WhatsApp/email) validados.
- [ ] Lista de patrocinadores/apoiadores confirmada.
- [ ] Revisao de ortografia e consistencia do texto final.

## 4) Performance minima para beta (obrigatorio)
- [ ] Imagens principais otimizadas e sem arquivos mortos fora de `img/fts`.
- [ ] Lighthouse Mobile >= 80 em Performance.
- [ ] Lighthouse >= 90 em Accessibility.
- [ ] Lighthouse >= 90 em Best Practices.
- [ ] Lighthouse >= 90 em SEO.

## 5) Publicacao (obrigatorio)
- [ ] Backup da versao anterior disponivel (rollback rapido).
- [ ] Deploy realizado em `https://www.fvvn.com.br/`.
- [ ] Teste de fumaca imediato apos deploy (home, inscricao, mapa, redes).
- [ ] Aprovacao final de 1 responsavel de negocio.

## 6) Primeiras 72h (monitoramento)
- [ ] Revisar analytics 2x ao dia (acessos, origem, paginas mais vistas).
- [ ] Verificar links quebrados e falhas de carregamento.
- [ ] Priorizar e corrigir bugs criticos no mesmo dia.
- [ ] Consolidar feedback e abrir lista de melhorias da versao 1.0.

## Resultado final
- [ ] Beta aprovado para comunicacao publica.
