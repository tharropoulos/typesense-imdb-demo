export default function ErrorPage({ status }: { status: number }) {
  const codeMap: Record<number, {title:string, description: string}> = {
    503: {
        title: "Service Unavailable",
        description: "Sorry, we are doing some maintenance. Please check back soon.",
    },
    500: {
        title: "Server Error",
        description: "Whoops, something went wrong on our servers.",
    },
    404:{
        title: "Page Not Found",
        description: "Sorry, the page you are looking for could not be found.",
    } ,
    403:{
        title: "Forbidden",
        description: "Sorry, you are forbidden from accessing this page"
    },
  };


  const { title, description } = codeMap[status] ?? {
    title: "Error",
    description: "An error occurred.",
  };


  return (
    <div>
      <h1 className="bg-blue-300 text-3xl">
        {status}: {title}
      </h1>
      <div>{description}</div>
    </div>
  );
}
