export function SDGProgress({ value = 0 }) {
    // Clamp between 0–100
    const clampedValue = Math.min(Math.max(value, 0), 100);

    // Color logic
    let colorClass = "bg-red-500";
    if (clampedValue > 70) colorClass = "bg-green-500";
    else if (clampedValue > 40) colorClass = "bg-yellow-400";
    else colorClass = "bg-red-500";

    return (
        <div className="w-full bg-gray-200/50 rounded-full h-3 overflow-hidden shadow-inner">
            <div
                className={`${colorClass} h-3 rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${clampedValue}%` }}
            ></div>
        </div>
    );
}
