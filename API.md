## images

### Creating an image

```bash
curl -F picture[image]=@pLDPqfwoVpo.jpg -F picture[type]=Icon -F picture[description]="опис" -F picture[language]=ру -F picture[alphabeth]=РУ --insecure https://localhost:33333/api/v1/images/create.json
```

```json
{"uid":"ca05594b-948e-4d05-80d8-a58f21793ae0","type":"Icon","width":2560,"height":1707,"meta":{},"language":"ру","alphabeth":"РУ","title":null,"description":"опис","thumb_url":"https://localhost:33333/images/thumb_ca05594b-948e-4d05-80d8-a58f21793ae0.webp","url":"https://localhost:33333/images/ca05594b-948e-4d05-80d8-a58f21793ae0.webp","attitudes":[]}
```

### Reading image properties

```bash
curl  --insecure https://localhost:33333/api/v1/images/ca05594b-948e-4d05-80d8-a58f21793ae0.json
```

```json
{"uid":"ca05594b-948e-4d05-80d8-a58f21793ae0","type":"Icon","width":2560,"height":1707,"meta":{},"language":"ру","alphabeth":"ру","title":null,"description":null,"thumb_url":"https://localhost:33333/images/thumb_ca05594b-948e-4d05-80d8-a58f21793ae0.webp","url":"https://localhost:33333/images/ca05594b-948e-4d05-80d8-a58f21793ae0.webp","attitudes":[]}
```
