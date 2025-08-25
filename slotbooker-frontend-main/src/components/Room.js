import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Room.css";

function Table({ element, date, slot }) {
  const [reserve, setReserve] = useState(0);
  const [avail, setAvail] = useState(element.seats_count);
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
          count: reserve,
          date: date,
          slot: slot,
        },
        {
          headers,
        }
      );
      //console.log(response.data);
      fetchBookings();
      if (reserve == 0) setAvail(element.seats_count);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:3001/book");
      //console.log(response.data.book);
      let count = 0;
      response.data.book.map((el) => {
        //console.log(el.date + " " + date + " " + (el.slot == slot));
        if (
          el.room_name == element.room_name &&
          el.table_name == element.table_name &&
          el.user_name == window.localStorage.getItem("name") &&
          el.date == date &&
          el.slot == slot
        ) {
          count = el.count;
        }
        setReserve(count);
      });
      count = 0;
      response.data.book.map((el) => {
        if (
          el.room_name == element.room_name &&
          el.table_name == element.table_name &&
          el.date == date &&
          el.slot == slot
        ) {
          count += el.count;
        }
      });
      setAvail(element.seats_count - count);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [date, slot]);
  useEffect(() => {
    fetchBookings();
  }, []);
  return (
    <>
      <div className="table">
        <div className="table-1">
          <div>
            <h1>{element.table_name}</h1>
          </div>
          <div className="table-1-1">
            <div>
              <b>Slots </b>
              <br /> <b>Available </b>
              <br />
              <b>Reserved</b>
            </div>
            <div>
              {element.seats_count}
              <br />
              {avail}
              <br />
              <input
                type="number"
                id="number"
                value={reserve}
                onChange={(e) => {
                  setReserve(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <div
          className="table-2"
          onClick={() => {
            handleReserve();
          }}
        >
          Book
        </div>
      </div>
    </>
  );
}

function Room() {
  const { id } = useParams();
  const [tables, setTables] = useState([]);
  const currDate = new Date(Date.now() + 86400000);
  const [date, setDate] = useState(currDate.toISOString().substring(0, 10));
  const [slot, setSlot] = useState("9-10");
  const fetchTables = async (id) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: window.localStorage.getItem("token"),
      };
      const response = await axios.post(
        "http://localhost:3001/table/fetch",
        {
          room: id,
        },
        {
          headers,
        }
      );
      //console.log(response.data);
      setTables(response.data.tables);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  useEffect(() => {
    fetchTables(id);
  }, []);
  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="/dashboard" className="-m-1.5 p-1.5">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
            <a
              href="/dashboard"
              className="text-sm font-semibold leading-6 text-green-700 pl-5 pt-1"
            >
              Slot Booker
            </a>
          </div>
          <div>
            <select
              value={slot}
              onChange={(e) => {
                setSlot(e.target.value);
              }}
            >
              <option value="9-10">09-10</option>
              <option value="10-11">10-11</option>
              <option value="11-12">11-12</option>
              <option value="12-13">12-13</option>
              <option value="13-14">13-14</option>
              <option value="14-15">14-15</option>
              <option value="15-16">15-16</option>
              <option value="16-17">16-17</option>
            </select>
            <input
              type="date"
              value={date}
              min={currDate.toISOString().substring(0, 10)}
              onChange={(e) => {
                console.log(e.target.value);
                setDate(e.target.value);
              }}
            />
          </div>
        </nav>
      </header>
      <div className="container">
        <div className="table-container">
          <h1>{id}</h1>
          {tables.map((element) => {
            return (
              <Table
                key={element._id}
                element={element}
                date={date}
                slot={slot}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Room;
