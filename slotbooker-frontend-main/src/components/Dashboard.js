import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Book({ element, fetchBookings }) {
  const handleReserve = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: window.localStorage.getItem("token"),
      };
      const response = await axios.post(
        "http://localhost:3001/book/add",
        {
          room_name: element.room_name,
          table_name: element.table_name,
          user_name: window.localStorage.getItem("name"),
          email: window.localStorage.getItem("email"),
          count: 0,
          date: element.date,
          slot: element.slot,
        },
        {
          headers,
        }
      );
      //console.log(response.data);
      fetchBookings();
    } catch (err) {
      console.log(err.response.data);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);
  return (
    <>
      <div className="table">
        <div className="table-1">
          <div className="table-1-1">
            <div>
              <br />
              <b>Room_name</b>
              <br />
              <b>Table_name</b>
              <br />
              <b>Date</b>
              <br />
              <b>Slot</b>
              <br />
              <b>Reserved </b>
              <br />
            </div>
            <div>
              <br />
              {element.room_name}
              <br />
              {element.table_name}
              <br />
              {element.date}
              <br />
              {element.slot}
              <br />
              {element.count}
              <br />
            </div>
          </div>
        </div>
        <div
          className="table-2"
          onClick={() => {
            handleReserve();
          }}
        >
          Cancel
        </div>
      </div>
    </>
  );
}

function Dashboard() {
  const username = window.localStorage.getItem("name");
  const [bookings, setbookings] = useState([]);
  const fetchBookings = async () => {
    try {
      let temp = [];
      const response = await axios.get("http://localhost:3001/book");
      //console.log(response.data.book);
      response.data.book.map((el) => {
        if (el.user_name == username) {
          temp.push(el);
        }
      });
      setbookings(temp);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchBookings();
  }, []);
  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-green-700 pl-5 pt-1"
            >
              Slot Booker
            </a>
          </div>
        </nav>
      </header>
      <div className="container">
        {bookings.map((el) => {
          return <Book element={el} fetchBookings={fetchBookings} />;
        })}
      </div>
    </>
  );
}

export default Dashboard;
