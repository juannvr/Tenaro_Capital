# Site da Tenaro Capital

Site estático em HTML, CSS e JavaScript, sem etapa de build. Tudo o que está nesta pasta pode ser publicado como está.

## Rodar localmente

```
python3 -m http.server 8000
```

Execute o comando nesta pasta e abra http://localhost:8000.

## Estrutura

- `index.html`: página principal
- `privacidade.html`: política de privacidade, com texto básico a revisar
- `css/styles.css`: estilos, organizados por seção
- `js/main.js`: menu no celular e envio do formulário
- `assets/img/`: imagens em AVIF, WebP e JPEG, em vários tamanhos, e a imagem de compartilhamento
- `assets/logo/`: favicons e logo usado nos dados estruturados

## Ativar o formulário

O formulário ainda não envia mensagens. Enquanto não houver destino, ele mostra ao visitante o e-mail e o WhatsApp.

Para ativar, crie um formulário em um serviço como o Formspree, com destino lucas@tenarocapital.com, e troque `action="#"` em `index.html` pelo endereço `https` recebido. Os nomes dos campos `_gotcha` (honeypot) e `_subject` (assunto) já seguem o padrão do Formspree. Se usar outro serviço, confira como ele trata esses dois campos.

Depois de escolher o serviço, atualize o fornecedor em `privacidade.html`.

## Trocar o cargo

O cargo atual é "Sócio-diretor". Para mudar, altere as três ocorrências em `index.html`:

- o texto alternativo da foto
- a legenda da foto
- a assinatura da carta

## Antes de publicar no domínio

- Em `privacidade.html`, resolva os itens entre colchetes e remova o aviso de revisão.
- As URLs de compartilhamento, `robots.txt` e `sitemap.xml` já apontam para https://tenarocapital.com. A prévia com imagem em redes sociais e no WhatsApp só funciona depois que o domínio estiver no ar.
- O e-mail do domínio passa pelo Google. Ao apontar o DNS para a hospedagem, altere só os registros do site (`A` da raiz e `CNAME` do `www`) e mantenha os registros `MX` e `TXT`.
