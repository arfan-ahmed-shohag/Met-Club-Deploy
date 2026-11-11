export default function CourseLoadingState() {
    return <div role="status" aria-busy="true" className="mx-auto grid min-h-[70vh] max-w-4xl place-content-center gap-5 px-5">
        <span className="sr-only">কোর্স লোড হচ্ছে</span>
        <div className="h-12 w-56 animate-pulse rounded-xl bg-red-100" />
        <div className="grid gap-4 sm:grid-cols-2"><div className="h-44 w-72 animate-pulse rounded-2xl bg-red-50" /><div className="h-44 w-72 animate-pulse rounded-2xl bg-slate-100" /></div>
    </div>;
}
