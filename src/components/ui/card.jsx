export function Card({ children, className = "" }) {
    return (
        <div className={`bg-white shadow-md rounded-xl p-4 ${className}`}>
            {children}
        </div>
    );
}

export function CardHeader({ children }) {
    return <div className="border-b pb-2 mb-2">{children}</div>;
}

export function CardContent({ children }) {
    return <div>{children}</div>;
}

export function CardTitle({ children }) {
    return <h3 className="text-lg font-semibold text-gray-800">{children}</h3>;
}
