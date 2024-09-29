import "./Home.css";
import { useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
  return (
    <>
      <div className="card-container">
        <div onClick={() => navigate("/library")} className="card">
          <img
            src="https://cdn.pixabay.com/photo/2024/04/19/12/13/ai-generated-8706226_640.png"
            alt="Image 1"
          />
          <p>
            <b>Library</b>
          </p>
        </div>
        <div onClick={() => navigate("/classroom")} className="card">
          <img
            src="https://img.freepik.com/free-vector/university-lecture-hall-with-teacher-students-sitting-desks-concept-education-conference-public-seminar-vector-flat-illustration-speaker-audience-college-classroom_107791-11162.jpg"
            alt="Image 2"
          />
          <p>Classroom</p>
        </div>
      </div>
    </>
  );
}

export default Home;
