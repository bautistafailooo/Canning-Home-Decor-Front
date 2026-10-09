import { useRef, useState } from 'react'
import { URL } from '../api/config'
import { useAuth } from '../context/AuthContext'

// 10 MB: es el limite que tiene puesto el back en application.properties
// (spring.servlet.multipart.max-file-size). Se chequea tambien aca para no
// mandar al pedo un archivo que va a rebotar.
const MAX_BYTES = 10 * 1024 * 1024

// Subida de fotos de producto.
//
// Manda el archivo a POST /uploads como multipart/form-data y guarda la
// direccion que devuelve el back. El valor que maneja es un array de URLs:
// la primera es la portada.
const PhotoUploader = ({ urls, onChange, disabled }) => {
  const { token } = useAuth()
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  // Sube UN archivo y devuelve su URL.
  //
  // Ojo con los headers: en multipart NO hay que poner Content-Type a mano.
  // El navegador lo arma solo con el "boundary" que separa las partes del
  // cuerpo; si lo escribimos nosotros, ese boundary falta y el back no
  // puede leer el archivo. Por eso aca no se usa headers() de api/config,
  // que siempre pone application/json: solo va el Authorization.
  const uploadOne = (file) => {
    const body = new FormData()
    body.append('file', file)

    return fetch(`${URL}/uploads`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body,
    })
      .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.message ?? 'No se pudo subir la foto')
        return data.url
      })
  }

  const handleFiles = (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    const tooBig = files.find((file) => file.size > MAX_BYTES)
    if (tooBig) {
      setError(`${tooBig.name} pesa más de 10 MB. Achicala antes de subirla.`)
      event.target.value = ''
      return
    }

    setError('')
    setUploading(true)

    // Promise.all las sube en paralelo y respeta el orden en que se
    // eligieron, aunque una termine antes que otra.
    Promise.all(files.map(uploadOne))
      .then((nuevas) => onChange([...urls, ...nuevas]))
      .catch((err) => setError(err.message))
      .finally(() => {
        setUploading(false)
        // Se limpia el input para poder volver a elegir el mismo archivo.
        event.target.value = ''
      })
  }

  const remove = (url) => onChange(urls.filter((u) => u !== url))

  // La portada es simplemente la primera del array.
  const makeCover = (url) => onChange([url, ...urls.filter((u) => u !== url)])

  return (
    <div className="uploader">
      <div className="uploader-actions">
        <input
          ref={inputRef}
          id="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="sr-only"
          onChange={handleFiles}
          disabled={disabled || uploading}
        />
        <button
          type="button"
          className="btn btn-outline btn-small"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || uploading}
        >
          {uploading ? 'Subiendo…' : 'Elegir fotos'}
        </button>
        <small>JPG, PNG, WEBP o GIF, hasta 10 MB cada una.</small>
      </div>

      {error && <div className="alert">{error}</div>}

      {urls.length === 0 ? (
        <p className="muted">Todavía no hay fotos. La primera que subas va a ser la portada.</p>
      ) : (
        <ul className="uploader-list">
          {urls.map((url, index) => (
            <li key={url} className="uploader-item">
              <div className="uploader-frame">
                <img src={url} alt="" />
                {index === 0 && <span className="uploader-cover">Portada</span>}
              </div>
              <div className="uploader-item-actions">
                {index !== 0 && (
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => makeCover(url)}
                    disabled={disabled || uploading}
                  >
                    Hacer portada
                  </button>
                )}
                <button
                  type="button"
                  className="link-button"
                  onClick={() => remove(url)}
                  disabled={disabled || uploading}
                >
                  Quitar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PhotoUploader
