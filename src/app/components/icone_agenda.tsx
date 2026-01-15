
export default function IconeAgenda () {
    return (
        <div className="agenda-icon">
            <svg viewBox="0 0 64 64" fill="none">
                {/* Calendário */}
                <rect x="6" y="10" width="36" height="34" rx="6" />
                <line x1="6" y1="18" x2="42" y2="18" />

                {/* Argolas */}
                <rect x="14" y="4" width="4" height="10" rx="2" />
                <rect x="30" y="4" width="4" height="10" rx="2" />

                {/* Grade */}
                <rect x="12" y="24" width="6" height="6" rx="2" />
                <rect x="22" y="24" width="6" height="6" rx="2" />
                <rect x="32" y="24" width="6" height="6" rx="2" />
                <rect x="12" y="34" width="6" height="6" rx="2" />
                <rect x="22" y="34" width="6" height="6" rx="2" />

                {/* Check */}
                <circle cx="46" cy="40" r="10" />
                <path d="M42 40l3 3 6-6" />
            </svg>
        </div>
    )
}