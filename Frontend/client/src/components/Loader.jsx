import { ClipLoader} from 'react-spinners';
export default function Loader({ size=50,color="#4B5563" }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <ClipLoader
        color={color}
        loading={true}
        size={size}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}   