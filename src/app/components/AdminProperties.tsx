import { useEffect, useMemo, useState } from 'react';
import { Trash2, PlusCircle, Edit2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import {
  fetchProperties,
  deleteProperty,
  createProperty,
  updateProperty,
  uploadPropertyImage,
} from '../../lib/propertiesService';
import { LocationPickerMap } from './LocationPickerMap';

type Props = { onClose: () => void; onReload: () => void };

export function AdminProperties({ onClose, onReload }: Props) {
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('success');

  const [properties, setProperties] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadPhase, setUploadPhase] = useState<'idle' | 'uploading' | 'finalizing'>('idle');
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    price?: string;
    location?: string;
    beds?: string;
    baths?: string;
    area?: string;
    image?: string;
  }>({});

  const [imageMode, setImageMode] = useState<'file' | 'url'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [draftTitle, setDraftTitle] = useState('');
  const [draftLocation, setDraftLocation] = useState('');
  const [draftCoords, setDraftCoords] = useState<{ lat: number; lng: number } | null>(null);

  const load = async () => {
    try {
      const res = await fetchProperties();
      setProperties([...res.available, ...res.sold]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    return () => {
      if (previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleDelete = async (id: string) => {
    setConfirmState({ open: true, kind: 'property', id, title: 'Eliminar propiedad', subtitle: 'Esta accion no se puede deshacer.' });
  };

  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loadingDeleteTestimonial, setLoadingDeleteTestimonial] = useState<string | null>(null);

  const loadTestimonials = async () => {
    try {
      const snap = await getDocs(collection(db, 'testimonials'));
      const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      setTestimonials(items);
    } catch (e) {
      console.error('Error cargando testimonios (admin):', e);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleDeleteTestimonial = async (id: string) => {
    setConfirmState({ open: true, kind: 'testimonial', id, title: 'Eliminar testimonio', subtitle: 'Esta accion no se puede deshacer.' });
  };

  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    kind: 'property' | 'testimonial' | null;
    id?: string;
    title?: string;
    subtitle?: string;
  }>({ open: false, kind: null });

  const doConfirmDelete = async () => {
    if (!confirmState.open || !confirmState.kind || !confirmState.id) return;

    if (confirmState.kind === 'property') {
      const id = confirmState.id;
      setLoadingDelete(id);
      setMessageType('info');
      setMessage('Eliminando propiedad...');
      try {
        await deleteProperty(id);
        setMessageType('success');
        setMessage('Propiedad eliminada');
        await load();
        onReload();
      } catch (e) {
        console.error(e);
        setMessageType('error');
        setMessage('Error al eliminar');
      } finally {
        setLoadingDelete(null);
        setTimeout(() => setMessage(null), 3000);
      }
    } else if (confirmState.kind === 'testimonial') {
      const id = confirmState.id;
      setLoadingDeleteTestimonial(id);
      setMessageType('info');
      setMessage('Eliminando testimonio...');
      try {
        await deleteDoc(doc(db, 'testimonials', id));
        setMessageType('success');
        setMessage('Testimonio eliminado');
        await loadTestimonials();
      } catch (e) {
        console.error('Error eliminando testimonio:', e);
        setMessageType('error');
        setMessage('Error al eliminar testimonio');
      } finally {
        setLoadingDeleteTestimonial(null);
        setTimeout(() => setMessage(null), 3000);
      }
    }

    setConfirmState({ open: false, kind: null });
  };

  const closeConfirm = () => setConfirmState({ open: false, kind: null });

  const resetFormState = (existing: any | null = null) => {
    if (previewImage.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage);
    }
    setSelectedFile(null);
    setImageMode('file');
    setImageUrlInput(existing?.image || '');
    setPreviewImage('');
    setUploadProgress(null);
    setUploadPhase('idle');
    setFormErrors({});
    setDraftTitle(existing?.title || '');
    setDraftLocation(existing?.location || '');
    setDraftCoords(
      typeof existing?.lat === 'number' && typeof existing?.lng === 'number'
        ? { lat: existing.lat, lng: existing.lng }
        : null
    );
  };

  const closeForm = () => {
    resetFormState(null);
    setEditing(null);
    setShowForm(false);
  };

  const openNew = () => {
    setEditing(null);
    resetFormState(null);
    setShowForm(true);
  };

  const openEdit = (p: any) => {
    setEditing(p);
    resetFormState(p);
    setShowForm(true);
  };

  const effectivePreview = useMemo(() => {
    if (imageMode === 'file') return previewImage || editing?.image || '';
    return imageUrlInput.trim() || editing?.image || '';
  }, [imageMode, previewImage, imageUrlInput, editing]);

  const mapQuery = draftLocation.trim();
  const mapsUrl = mapQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`
    : '';

  const handleSubmit = async (form: FormData) => {
    setSubmitting(true);
    setUploadProgress(null);
    setUploadPhase('idle');
    setFormErrors({});

    try {
      const title = (form.get('title') as string) || '';
      const price = (form.get('price') as string) || '';
      const location = (form.get('location') as string) || '';
      const bedsRaw = Number(form.get('beds'));
      const bathsRaw = Number(form.get('baths'));
      const areaRaw = Number(form.get('area'));
      const beds = Number.isFinite(bedsRaw) ? bedsRaw : 0;
      const baths = Number.isFinite(bathsRaw) ? bathsRaw : 0;
      const area = Number.isFinite(areaRaw) ? areaRaw : 0;
      const sold = form.get('sold') === 'on';
      const description = (form.get('description') as string) || '';

      let imageUrl = editing?.image || '';
      const manualImageUrl = imageUrlInput.trim();

      const errors: typeof formErrors = {};
      if (!title.trim()) errors.title = 'El titulo es obligatorio.';
      if (!price.trim()) errors.price = 'El precio es obligatorio.';
      if (!location.trim()) errors.location = 'La ubicacion es obligatoria.';

      const numericPrice = Number(price.replace(/[^\d.,-]/g, '').replace(',', '.'));
      if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
        errors.price = 'El precio debe ser un numero mayor a 0.';
      }
      if (!Number.isFinite(beds) || beds <= 0) {
        errors.beds = 'Las habitaciones deben ser mayores a 0.';
      }
      if (!Number.isFinite(baths) || baths <= 0) {
        errors.baths = 'Los banos deben ser mayores a 0.';
      }
      if (!Number.isFinite(area) || area <= 0) {
        errors.area = 'El area debe ser mayor a 0.';
      }

      if (imageMode === 'file' && selectedFile) {
        if (!selectedFile.type.startsWith('image/')) {
          errors.image = 'El archivo seleccionado no es una imagen valida.';
        }
        if (selectedFile.size > 8 * 1024 * 1024) {
          errors.image = 'La imagen supera 8MB. Usa una imagen mas pequena.';
        }
      } else if (imageMode === 'url' && manualImageUrl) {
        let parsedUrl: URL;
        try {
          parsedUrl = new URL(manualImageUrl);
        } catch {
          errors.image = 'La URL de la imagen no es valida. Usa una URL completa (https://...).';
          parsedUrl = new URL('https://placeholder.local');
        }
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
          errors.image = 'La URL de la imagen debe empezar con http:// o https://';
        }
        imageUrl = manualImageUrl;
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        setMessageType('error');
        setMessage('Corrige los campos marcados e intenta nuevamente.');
        return;
      }

      if (imageMode === 'file' && selectedFile) {
        setUploadPhase('uploading');
        setUploadProgress(1);
        imageUrl = await uploadPropertyImage(selectedFile, 'properties', (progress) =>
          setUploadProgress(Math.max(1, progress))
        );
        setUploadPhase('finalizing');
        setUploadProgress(100);
      }

      const payload = {
        title,
        price,
        location,
        beds,
        baths,
        area,
        image: imageUrl,
        sold,
        description,
        lat: draftCoords?.lat,
        lng: draftCoords?.lng,
      };

      if (editing?.id) {
        setMessageType('info');
        setMessage('Actualizando propiedad...');
        await updateProperty(editing.id, payload);
        setMessageType('success');
        setMessage('Propiedad actualizada');
      } else {
        setMessageType('info');
        setMessage('Creando propiedad...');
        await createProperty(payload as any);
        setMessageType('success');
        setMessage('Propiedad creada');
      }

      await load();
      onReload();
      closeForm();
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'Error en la peticion';
      setMessageType('error');
      setMessage(errorMessage);
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
      setUploadPhase('idle');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="bg-white rounded-xl shadow-xl p-6 z-70 w-[96vw] max-w-[1700px] h-[94vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Panel Admin - Propiedades</h3>
          <div className="flex items-center gap-2">
            <button onClick={openNew} className="bg-green-600 text-white px-3 py-2 rounded flex items-center gap-2">
              <PlusCircle size={16} /> Nueva
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">Cerrar</button>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-3">
          {message && (
            <div className={`text-sm ${
              messageType === 'error'
                ? 'text-red-600'
                : messageType === 'info'
                  ? 'text-blue-600'
                  : 'text-green-600'
            }`}>
              {message}
            </div>
          )}
          <div className="text-sm text-gray-600">Las propiedades se cargan desde la coleccion <code>properties</code> en Firestore.</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {properties.map((p) => (
            <div key={p.id} className={`border rounded p-3 flex gap-3 items-start ${p.sold ? 'bg-gray-50' : ''}`}>
              <img src={p.image} alt={p.title} className="w-28 h-20 object-cover rounded" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{p.title}</div>
                      {p.sold ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Vendido</span>
                      ) : (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Disponible</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">{p.location} • {p.price}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="text-blue-600 hover:text-blue-800" title="Editar"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800" title="Eliminar">
                      {loadingDelete === p.id ? '...' : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-700 mt-2">{p.beds} hab • {p.baths} banos • {p.area} m2</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-semibold mb-3">Testimonios (Admin)</h4>
          <div className="space-y-3">
            {testimonials.length === 0 && <div className="text-sm text-gray-500">No hay testimonios guardados.</div>}
            {testimonials.map((t) => (
              <div key={t.id} className="border rounded p-3 bg-white flex justify-between items-start">
                <div>
                  <div className="font-semibold">{t.name} <span className="text-sm text-gray-500">· {t.role}</span></div>
                  <div className="text-sm text-gray-700 italic">"{t.text}"</div>
                </div>
                <div className="flex items-start gap-2">
                  <button onClick={() => handleDeleteTestimonial(t.id)} className="text-red-600 hover:text-red-800" title="Eliminar testimonio">
                    {loadingDeleteTestimonial === t.id ? '...' : <Trash2 size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {confirmState.open && (
          <div className="fixed inset-0 z-100 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={closeConfirm}></div>
            <div className="bg-white rounded-lg shadow-lg p-6 z-110 w-11/12 max-w-lg">
              <h3 className="text-xl font-semibold mb-2">{confirmState.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{confirmState.subtitle}</p>
              <div className="flex items-center gap-3 justify-end">
                <button onClick={closeConfirm} className="px-4 py-2 border rounded">Cancelar</button>
                <button onClick={doConfirmDelete} className="px-4 py-2 bg-red-600 text-white rounded">Eliminar</button>
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-80 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={closeForm}></div>
            <div className="bg-white rounded-xl shadow p-4 z-90 w-[96vw] max-w-[1700px] h-[94vh] overflow-auto">
              <h4 className="text-lg font-semibold mb-2">{editing ? 'Editar propiedad' : 'Nueva propiedad'}</h4>
              <form noValidate onSubmit={async (e) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); await handleSubmit(fd); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label className="block">
                    <div className="text-sm text-gray-700 mb-0.5">Titulo</div>
                    <input name="title" value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} className="w-full px-3 py-1.5 border rounded" required />
                    {formErrors.title && <div className="text-xs text-red-600 mt-1">{formErrors.title}</div>}
                  </label>

                  <label className="block">
                    <div className="text-sm text-gray-700 mb-0.5">Precio</div>
                    <input name="price" defaultValue={editing?.price || ''} className="w-full px-3 py-1.5 border rounded" required />
                    {formErrors.price && <div className="text-xs text-red-600 mt-1">{formErrors.price}</div>}
                  </label>

                  <label className="block">
                    <div className="text-sm text-gray-700 mb-0.5">Ubicacion</div>
                    <input name="location" value={draftLocation} onChange={(e) => setDraftLocation(e.target.value)} className="w-full px-3 py-1.5 border rounded" />
                    {formErrors.location && <div className="text-xs text-red-600 mt-1">{formErrors.location}</div>}
                  </label>

                  <label className="block">
                    <div className="text-sm text-gray-700 mb-0.5">Habitaciones</div>
                    <input name="beds" type="number" defaultValue={editing?.beds || 0} className="w-full px-3 py-1.5 border rounded" />
                    {formErrors.beds && <div className="text-xs text-red-600 mt-1">{formErrors.beds}</div>}
                  </label>

                  <label className="block">
                    <div className="text-sm text-gray-700 mb-0.5">Banos</div>
                    <input name="baths" type="number" defaultValue={editing?.baths || 0} className="w-full px-3 py-1.5 border rounded" />
                    {formErrors.baths && <div className="text-xs text-red-600 mt-1">{formErrors.baths}</div>}
                  </label>

                  <label className="block">
                    <div className="text-sm text-gray-700 mb-0.5">Area (m2)</div>
                    <input name="area" type="number" defaultValue={editing?.area || 0} className="w-full px-3 py-1.5 border rounded" />
                    {formErrors.area && <div className="text-xs text-red-600 mt-1">{formErrors.area}</div>}
                  </label>

                  <label className="col-span-1 md:col-span-2 block">
                    <div className="text-sm text-gray-700 mb-0.5">Descripcion</div>
                    <textarea name="description" defaultValue={editing?.description || ''} className="w-full px-3 py-1.5 border rounded h-20 resize-none" />
                  </label>

                  <div className="col-span-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-700">Verificar ubicacion en mapa</div>
                      {mapsUrl && (
                        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-700 hover:text-blue-800">
                          Abrir en Google Maps
                        </a>
                      )}
                    </div>

                    <LocationPickerMap
                      query={mapQuery}
                      coordinates={draftCoords}
                      onCoordinatesChange={setDraftCoords}
                      onLocationChange={setDraftLocation}
                    />
                  </div>

                  <div className="col-span-1">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <label className="inline-flex items-center gap-3 rounded-lg bg-slate-200 px-4 py-2 text-slate-900 font-semibold">
                        <input type="checkbox" name="sold" defaultChecked={!!editing?.sold} className="h-5 w-5 accent-blue-600" />
                        Marcar como VENDIDO
                      </label>
                    </div>

                    <div className="text-sm text-gray-700 mb-1">Imagen</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => setImageMode('file')}
                        className={`px-3 py-1 rounded border ${imageMode === 'file' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700'}`}
                      >
                        Subir archivo
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode('url')}
                        className={`px-3 py-1 rounded border ${imageMode === 'url' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700'}`}
                      >
                        Pegar URL
                      </button>
                    </div>

                    {imageMode === 'file' ? (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setSelectedFile(file);

                          if (previewImage.startsWith('blob:')) {
                            URL.revokeObjectURL(previewImage);
                          }

                          if (file) {
                            const localPreview = URL.createObjectURL(file);
                            setPreviewImage(localPreview);
                          } else {
                            setPreviewImage('');
                          }
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="https://..."
                        value={imageUrlInput}
                        onChange={(e) => {
                          setImageUrlInput(e.target.value);
                          setSelectedFile(null);
                          if (previewImage.startsWith('blob:')) {
                            URL.revokeObjectURL(previewImage);
                          }
                          setPreviewImage('');
                        }}
                        className="w-full px-3 py-1.5 border rounded"
                      />
                    )}
                    {formErrors.image && <div className="text-xs text-red-600 mt-1">{formErrors.image}</div>}

                    <div className="mt-2">
                      <div className="text-xs text-gray-500 mb-1">Vista previa</div>
                      {effectivePreview ? (
                        <img src={effectivePreview} alt="preview" className="w-full h-64 object-cover rounded border" />
                      ) : (
                        <div className="w-full h-64 rounded border flex items-center justify-center text-sm text-gray-500 bg-gray-50">
                          Sin imagen seleccionada
                        </div>
                      )}
                    </div>

                    {submitting && uploadProgress !== null && (
                      <div className="mt-3 max-w-sm">
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <div className="mt-1 text-xs text-blue-700">
                          {uploadPhase === 'uploading'
                            ? `Subiendo imagen: ${uploadProgress}%`
                            : 'Finalizando subida...'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 w-full flex items-center justify-center gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-14 py-4 text-xl font-semibold rounded-xl min-w-[320px] shadow-sm"
                  >
                    {submitting ? 'Guardando...' : (editing ? 'Actualizar' : 'Crear')}
                  </button>
                  <button type="button" onClick={closeForm} className="px-4 py-2 border rounded-lg">Cancelar</button>
                </div>
                {message && (
                  <div
                    className={`mt-3 text-sm ${
                      messageType === 'error'
                        ? 'text-red-600'
                        : messageType === 'info'
                          ? 'text-blue-600'
                          : 'text-green-600'
                    }`}
                  >
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
