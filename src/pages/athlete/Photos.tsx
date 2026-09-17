import { PHOTO_SLOTS, SLOT_LABEL, type PhotoSlot } from "../../types";
import { useStore } from "../../store/StoreContext";

export function AthletePhotos() {
  const { currentAthlete, upsertPhoto, removePhoto } = useStore();
  if (!currentAthlete) return null;
  function onFile(slot: PhotoSlot, file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === "string") upsertPhoto(slot, reader.result); };
    reader.readAsDataURL(file);
  }
  return (
    <div className="page">
      <div className="kicker">Reference photos</div>
      <h1 style={{ fontSize: 42 }}>Your body of work</h1>
      <p className="muted">Front, sides, back, action. These exact files are what brands see.</p>
      <div className="slot-grid" style={{ marginTop: 20 }}>
        {PHOTO_SLOTS.map((slot) => {
          const photo = currentAthlete.photos.find((p) => p.slot === slot);
          return (
            <label key={slot} className="slot" style={{ cursor: "pointer" }}>
              {photo ? <img src={photo.dataUrl} alt={slot} /> : null}
              <span className="slot-lab">{SLOT_LABEL[slot]}</span>
              <input type="file" accept="image/*" hidden onChange={(e) => onFile(slot, e.target.files?.[0])} />
              {photo && <button type="button" className="btn btn-sm btn-danger" style={{ position: "absolute", top: 8, right: 8 }} onClick={(e) => { e.preventDefault(); removePhoto(photo.id); }}>Remove</button>}
            </label>
          );
        })}
      </div>
    </div>
  );
}
