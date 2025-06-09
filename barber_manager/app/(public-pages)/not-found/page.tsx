export default async function NotFoundPage() {
  return (
    <div className="flex flex-col gap-6 items-center">
      <h1 className="text-3xl">Sorry, seems like this shop does not exist in our database</h1>
      <h2 className="text-1xl">Please check the url and try again</h2>
    </div>
  );
}
