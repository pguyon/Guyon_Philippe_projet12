import React, { useState, useEffect } from "react";
import "./Activity.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PropTypes from "prop-types";
import { getUserActivity } from "../../services/Api";
import { userDataActivityModel } from "../../services/UserDataModel";
import Loader from "../loader/Loader";

/**
 * I'm using react-chartjs-2 to display a bar chart. I'm using a custom tooltip to display the value of
 * each bar.
 * @type {function}
 * @param {number} userId - users'id to fecth data from API
 * @return jsx
 * @author Philippe Guyon
 * @version 1.0
 */

const Activity = ({ userId }) => {
  const [userDataActivity, setUserDataActivity] = useState({});
  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    getUserActivity(userId).then((response) => {
      const formattedUserDataActivity = new userDataActivityModel(
        response.data
      );
      setUserDataActivity(formattedUserDataActivity);
      setIsloading(true);
      return response.data;
    });
  }, [userId]);

  /**
   * If the chart is active, return a div with the value of the first and second payloads. If the chart
   * is not active, return null.
   * @type {function}
   * @param {array} payload
   * @param {boolean} active
   * @returns a div with two p tags.
   */
  function CustomTooltip({ payload, active }) {
    if (active) {
      return (
        <div className="hover__activity">
          <p>{`${payload[0].value}`}kg</p>
          <p>{`${payload[1].value}`}KCal</p>
        </div>
      );
    }
    return null;
  }

  /**
   * It takes a date in the format of a string, converts it to a date object, then returns the date in
   * the format of a string.
   * @param tickItem - The value of the tick item.
   * @returns the date in the format of the options object.
   */
  function FormatDate(tickItem) {
    var options = {
      day: "numeric",
    };
    const formatedDate = new Date(tickItem);
    return formatedDate.toLocaleDateString("fr-FR", options);
  }

  if (!isLoading) {
    return <Loader />;
  } else {
    return (
      <section className="activity__wrapper">
        <div className="activity__title">
          <h3>Activité quotidienne</h3>
          <div className="wrapper">
            <div className="content">
              <div className="black__bullet"></div>
              <span>Poids (kg)</span>
            </div>
            <div className="content">
              <div className="red__bullet"></div>
              <span>Calories brûlées (kCal)</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart
            width="100%"
            height="75%"
            barGap={8}
            data={userDataActivity.sessions}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="1"
              style={{
                padding: "0",
                margin: "0",
              }}
            />
            <XAxis
              tickMargin={10}
              tickLine={false}
              padding={{
                left: 0,
                right: 0,
              }}
              axisLine={{ stroke: "#DEDEDE" }}
              tick={{
                fill: "#9B9EAC",
                fontSize: "14px",
              }}
              dataKey="day"
              tickFormatter={FormatDate}
            />
            <YAxis
              yAxisId="kilogram"
              dataKey="kilogram"
              orientation="right"
              domain={["dataMin-2", "dataMax+1"]}
              tickCount="3"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#9B9EAC",
                fontSize: "14px",
              }}
              style={{ marginLeft: "20px" }}
              dx={45}
              scale="auto"
            />
            <YAxis yAxisId="calories" dataKey="calories" hide={true} />
            <Tooltip
              position={{ y: -25 }}
              content={<CustomTooltip />}
              cursor={{
                background: "#C4C4C4",
                opacity: 0.5,
              }}
            />
            <Bar
              dataKey="kilogram"
              yAxisId="kilogram"
              fill="#282D30"
              barSize={7.5}
              radius={[50, 50, 0, 0]}
            />
            <Bar
              dataKey="calories"
              yAxisId="calories"
              fill="#E60000"
              barSize={7.5}
              radius={[50, 50, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </section>
    );
  }
};
/* It's a propTypes validation. It's a way to check if the props are of the right type. */
Activity.propTypes = {
  userId: PropTypes.number.isRequired,
  payload: PropTypes.object,
  active: PropTypes.bool,
};

export default Activity;
