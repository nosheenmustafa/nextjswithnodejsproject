import EditProduct from "./editproduct";

// Define HomeProps for dynamic route
interface HomeProps {
  params: {
    id: string;
  };
}

// Ensure the function is asynchronous to resolve params
export default async function Home({ params }: HomeProps) {
  const { id } = params; // Destructure id from params

  // console.log("Product ID is:", id); // Debug: Print the ID in the console

  return (
    <div>
      <main>
        <div>
          {/* Pass the params prop to EditProduct */}
          <EditProduct params={{ id }} />
          
        </div>
      </main>
    </div>
  );
}
