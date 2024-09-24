export default function Headline({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="w-full flex flex-col md:items-center gap-3 md:gap-1.5 pb-16">
      <h1 className="font-mona text-left md:text-center text-[2.8rem] md:text-5xl leading-none md:leading-tight font-black">
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground text-left md:text-center pl-0.5 md:pl-0 text-lg leading-6 md:leading-8">
          {description}
        </p>
      )}
    </div>
  );
}
