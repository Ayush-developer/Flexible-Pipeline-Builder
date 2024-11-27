import './index.css';
import { useStore } from './store'; // Import your Zustand store

export const SubmitButton = () => {
    const submitPipeline = useStore((state) => state.submitPipeline); // Get submitPipeline from store

    return (
        <div className="footer">
            <button type="button" onClick={submitPipeline}>Submit</button>
        </div>
    );
}