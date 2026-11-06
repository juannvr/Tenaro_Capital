# Site da Tenaro Capital

Site estático em HTML, CSS e JavaScript, sem etapa de build. Tudo o que está nesta pasta pode ser publicado como está.

## Rodar localmente

```
python3 -m http.server 8000
```

Execute o comando nesta pasta e abra http://localhost:8000.

## Estrutura

- `index.html`: página principal
- `privacidade.html`: política de privacidade
- `css/styles.css`: estilos, organizados por seção
- `js/main.js`: menu no celular e envio do formulário
- `assets/img/`: imagens em AVIF, WebP e JPEG, em vários tamanhos, e a imagem de compartilhamento
- `assets/logo/`: favicons e logo usado nos dados estruturados

## Envio do formulário

O formulário envia direto para lucas@tenarocapital.com pelo Formspree. O destino é o atributo `action` do formulário em `index.html`. Se o envio falhar, o visitante vê a opção de abrir a mensagem pronta no WhatsApp ou no e-mail.

Nas configurações do formulário no Formspree, vale restringir o envio aos domínios do site. Ao mudar para o domínio definitivo, inclua `tenarocapital.com`.

## Trocar o cargo

O cargo atual é "Sócio-diretor". Para mudar, altere as três ocorrências em `index.html`:

- o texto alternativo da foto
- a legenda da foto
- a assinatura da carta

## Antes de publicar no domínio

- As URLs de compartilhamento, `robots.txt` e `sitemap.xml` já apontam para https://tenarocapital.com. A prévia com imagem em redes sociais e no WhatsApp só funciona depois que o domínio estiver no ar.
- O e-mail do domínio passa pelo Google. Ao apontar o DNS para a hospedagem, altere só os registros do site (`A` da raiz e `CNAME` do `www`) e mantenha os registros `MX` e `TXT`.
