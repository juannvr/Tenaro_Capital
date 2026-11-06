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

## Ativar o envio direto do formulário

Sem um serviço configurado, ao terminar as duas etapas o visitante escolhe entre WhatsApp e e-mail, e a mensagem abre pronta. Com o serviço configurado, o e-mail chega direto, e essa escolha só aparece se o envio falhar.

Para ativar:

1. Crie uma conta em https://formspree.io e um formulário com destino lucas@tenarocapital.com.
2. Confirme o endereço de destino pelo e-mail que o Formspree enviar.
3. Troque `action="#"` em `index.html` pelo endereço recebido, no formato `https://formspree.io/f/xxxxxxxx`.
4. Nas configurações do formulário, restrinja o envio aos domínios do site.

## Trocar o cargo

O cargo atual é "Sócio-diretor". Para mudar, altere as três ocorrências em `index.html`:

- o texto alternativo da foto
- a legenda da foto
- a assinatura da carta

## Antes de publicar no domínio

- As URLs de compartilhamento, `robots.txt` e `sitemap.xml` já apontam para https://tenarocapital.com. A prévia com imagem em redes sociais e no WhatsApp só funciona depois que o domínio estiver no ar.
- O e-mail do domínio passa pelo Google. Ao apontar o DNS para a hospedagem, altere só os registros do site (`A` da raiz e `CNAME` do `www`) e mantenha os registros `MX` e `TXT`.
