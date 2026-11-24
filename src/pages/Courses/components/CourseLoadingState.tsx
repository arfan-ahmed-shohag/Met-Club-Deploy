// Placeholder shaped like the course map (the first screen of the course app),
// using the same sizes as public/courses/anticipatory-action/course.css
// (.wrap, .dash, .card, .path, .ch) so the page does not jump when it loads.
// Each "line" div is as tall as one line of the real text (font size × line height);
// the grey bar inside it stands in for the words.

const shadow =
  "shadow-[0_1px_0_rgba(31,29,28,.06),0_12px_30px_-16px_rgba(31,29,28,.35)]";
const cardClass = `rounded-[20px] bg-white p-[22px] ${shadow}`;
// left stripe colours of the five chapters (blue, ochre, red, green, navy)
const chapterColors = ["#1c8fd6", "#c47a22", "#da291c", "#138a6b", "#283a7a"];

function Line({
  height,
  bar,
  width,
  tone = "bg-gray-200",
  display = "flex",
}: {
  height: string;
  bar: string;
  width: string;
  tone?: string;
  /** Tailwind display classes, to show a wrapped second line only at some widths. */
  display?: string;
}) {
  return (
    <div className={`items-center ${display} ${height}`}>
      <div className={`rounded-full ${tone} ${bar} ${width}`} />
    </div>
  );
}

export default function CourseLoadingState({
  isEnglish = false,
}: {
  isEnglish?: boolean;
}) {
  return (
    <div
      role="status"
      aria-busy="true"
      className="mx-auto w-full max-w-[1440px] animate-pulse px-5 pt-[18px] pb-16 sm:px-6 lg:px-8"
    >
      <span className="sr-only">
        {isEnglish ? "Loading the course" : "কোর্স লোড হচ্ছে"}
      </span>

      {/* .dash: welcome card + certificate card */}
      <div
        aria-hidden="true"
        className="grid grid-cols-1 gap-4 min-[781px]:grid-cols-[1.25fr_1fr]"
      >
        <div className={`${cardClass} flex flex-col gap-4`}>
          <div>
            <Line height="h-[25px]" bar="h-3.5" width="w-20" tone="bg-red-100" />
            <Line height="h-[42px]" bar="h-8" width="w-3/5" />
            <Line height="h-[26px]" bar="h-4" width="w-4/5" />
          </div>
          <div>
            <div className="flex h-[26px] items-center justify-between">
              <div className="h-4 w-32 rounded-full bg-gray-200" />
              <div className="h-4 w-12 rounded-full bg-gray-200" />
            </div>
            <div className="mt-1 h-3.5 rounded-full border border-gray-200 bg-gray-100" />
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="h-[54px] w-56 rounded-[14px] bg-red-200" />
            <div className="h-[54px] w-48 rounded-[14px] bg-gray-200" />
            <div className="h-[54px] w-36 rounded-[14px] bg-gray-200" />
          </div>
        </div>

        <div className={`${cardClass} flex flex-col gap-4`}>
          <div className="flex h-[26px] items-center justify-between">
            <div className="h-6 w-44 rounded-full bg-gray-200" />
            <div className="h-5 w-20 rounded-full bg-amber-100" />
          </div>
          {["w-4/5", "w-full", "w-11/12"].map((width, row) => (
            <div key={width} className="flex items-start gap-2.5">
              <div className="mt-px h-6 w-6 shrink-0 rounded-full border-2 border-gray-200" />
              <div className="flex-1">
                <Line height="h-[26px]" bar="h-4" width={width} />
                {/* the longest requirement wraps to a second line on phones */}
                {row === 1 && (
                  <Line
                    height="h-[26px]"
                    bar="h-4"
                    width="w-2/5"
                    display="flex min-[601px]:hidden"
                  />
                )}
              </div>
            </div>
          ))}
          <div>
            <Line height="h-[24px]" bar="h-3" width="w-full" />
            {/* the note wraps to two lines on phones and in the narrow two-column layout */}
            <Line
              height="h-[24px]"
              bar="h-3"
              width="w-1/2"
              display="flex min-[601px]:hidden min-[781px]:flex"
            />
          </div>
          <div className="h-[54px] rounded-[14px] bg-gray-200" />
        </div>
      </div>

      {/* .path: one row per chapter */}
      <div aria-hidden="true" className="mt-6 flex flex-col gap-3.5">
        {chapterColors.map((color) => (
          <div
            key={color}
            className={`relative grid grid-cols-[60px_minmax(0,1fr)] items-center gap-4 overflow-hidden rounded-[22px] bg-white py-3.5 pr-[18px] pl-3.5 min-[601px]:grid-cols-[76px_minmax(0,1fr)_auto] ${shadow}`}
          >
            <span
              className="absolute inset-y-0 left-0 w-2 opacity-40"
              style={{ background: color }}
            />
            <div
              className="ml-1.5 h-[54px] w-[54px] rounded-[20px] opacity-25 min-[601px]:h-[68px] min-[601px]:w-[68px]"
              style={{ background: color }}
            />
            <div>
              <Line height="h-[25px]" bar="h-3.5" width="w-20" />
              <Line height="h-[26px]" bar="h-5" width="w-3/5" />
              <Line height="h-[27px]" bar="h-3.5" width="w-4/5" />
              {/* chapter subtitles wrap to a second line on phones */}
              <Line
                height="h-[22px]"
                bar="h-3.5"
                width="w-1/2"
                display="flex min-[601px]:hidden"
              />
            </div>
            <div className="col-span-full flex h-[23px] items-center min-[601px]:col-span-1">
              <div className="h-5 w-24 rounded-full bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
