export default function HUDWrapper({ children }) {
    return (
        <div
            className="
        absolute top-6 left-1/2 -translate-x-1/2
        w-full max-w-[60%]
        flex justify-center gap-6
        pointer-events-none
        z-50
      "
        >
            {children}
        </div>
    );
}
