import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

function Card({ element, date, slot }) {
  const [available, setAvailable] = useState(element.available_seats);
  const [reserved, setReserved] = useState(0);
  const navigate = useNavigate();
  const fetchBookings = async () => {
    try {
      let count = 0;
      const response = await axios.get("http://localhost:3001/book");
      response.data.book.map((el) => {
        if (
          el.room_name == element.name &&
          el.user_name == window.localStorage.getItem("name") &&
          el.date == date &&
          el.slot == slot
        ) {
          count += el.count;
        }
      });
      setReserved(count);
      count = 0;
      response.data.book.map((el) => {
        if (
          el.room_name == element.name &&
          el.date == date &&
          el.slot == slot
        ) {
          count += el.count;
        }
      });
      setAvailable(element.seats_count - count);
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
    <div
      className="card"
      onClick={() => {
        navigate("/room/" + element.name);
      }}
    >
      <div className="card-1">
        <div>
          <b>Slots </b>
          <br /> <b>Available </b>
          <br />
          <b>Block </b>
          <br />
          <b>Reserved</b>
        </div>
        <div>
          {element.seats_count}
          <br />
          {available}
          <br />
          {element.building_name}
          <br />
          {reserved}
        </div>
      </div>
      <div className="card-2">
        <b>{element.name}</b>
      </div>
    </div>
  );
}

function Home() {
  const [rooms, setRooms] = useState([]);
  const username = window.localStorage.getItem("name");
  const [room_name, setRoom_name] = useState("");
  const [building_name, setBuilding_name] = useState("");
  const [tables, setTables] = useState([
    { id: "1", name: "", seat_count: "0" },
  ]);
  const currDate = new Date(Date.now() + 86400000);
  const [date, setDate] = useState(currDate.toISOString().substring(0, 10));
  const [slot, setSlot] = useState("9-10");

  const fetchRooms = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: window.localStorage.getItem("token"),
      };
      const response = await axios.get("http://localhost:3001/room/fetch", {
        headers,
      });
      setRooms(response.data.rooms);
    } catch (err) {
      console.log(err);
    }
  };
  const handleChange = (e) => {
    const updatedItems = tables.map((item) =>
      item.id == e.target.id ? { ...item, name: e.target.value } : item
    );
    if (e.target.id == tables.length && tables[tables.length - 1].name == "") {
      const newItem = {
        id: Number(e.target.id) + 1,
        name: "",
        seat_count: 0,
      };
      setTables([...updatedItems, newItem]);
      return;
    }
    setTables(updatedItems);
  };
  const handleChangeSlot = (e) => {
    const updatedItems = tables.map((item) =>
      item.id == e.target.id ? { ...item, seat_count: e.target.value } : item
    );
    setTables(updatedItems);
  };
  const handleSubmit = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: window.localStorage.getItem("token"),
      };
      let seats_count = 0;
      for (let i = 0; i < tables.length; i++) {
        let element = tables[i];
        if (element.name != "") {
          let res = await axios.post(
            "http://localhost:3001/table/add",
            {
              role: "admin",
              room_name: room_name,
              table_name: element.name,
              seats_count: element.seat_count,
            },
            { headers }
          );
          seats_count += Number(element.seat_count);
        }
      }

      const response = await axios.post(
        "http://localhost:3001/room/create",
        {
          role: "admin",
          name: room_name,
          building_name: building_name,
          seats_count: seats_count,
        },
        { headers }
      );
      setBuilding_name();
      setRoom_name();
      setTables([{ id: "1", name: "", seat_count: "0" }]);
      fetchRooms();
    } catch (err) {
      console.log(err);
    }
  };
  let navigate = useNavigate();
  useEffect(() => {
    fetchRooms();
  }, []);
  return (
    <>
      <div>
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
        <div>
          {username == "admin" && (
            <div style={{ margin: "5%" }}>
              <b>Add Room</b>
              <br />
              <input
                style={{
                  margin: "1%",
                  border: "1px solid grey",
                  padding: "8px",
                  borderRadius: "5px",
                }}
                type="text"
                placeholder="room_name"
                value={room_name}
                onChange={(e) => {
                  setRoom_name(e.target.value);
                }}
              />
              <br />
              <input
                style={{
                  margin: "1%",
                  border: "1px solid grey",
                  padding: "8px",
                  borderRadius: "5px",
                }}
                type="text"
                placeholder="building_name"
                value={building_name}
                onChange={(e) => {
                  setBuilding_name(e.target.value);
                }}
              />
              <br />

              {tables.map((element) => {
                return (
                  <div>
                    <input
                      id={element.id}
                      style={{
                        margin: "1%",
                        border: "1px solid grey",
                        padding: "8px",
                        borderRadius: "5px",
                      }}
                      type="text"
                      placeholder="table_name"
                      value={element.name}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                    <input
                      id={element.id}
                      style={{
                        margin: "1%",
                        border: "1px solid grey",
                        padding: "8px",
                        borderRadius: "5px",
                      }}
                      type="number"
                      placeholder="slots"
                      value={element.seat_count}
                      onChange={(e) => {
                        handleChangeSlot(e);
                      }}
                    />
                    <br />
                  </div>
                );
              })}

              <button
                style={{
                  margin: "1%",
                  marginLeft: "25%",
                  backgroundColor: "black",
                  color: "white",
                  padding: "8px",
                  borderRadius: "5px",
                }}
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          )}
        </div>
        <div className="card-container">
          {rooms.map((element) => {
            return (
              <Card
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

export default Home;
