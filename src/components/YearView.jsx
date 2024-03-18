import { Navigate, Views } from "react-big-calendar";
import Calendar from "react-calendar";
import { Grid, GridItem } from "@chakra-ui/react";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

export default function YearView({
  date,
  localizer,
  onView,
  onNavigate,
  events,
}) {
  const currRange = YearView.range(date, { localizer });

  return (
    <Grid templateColumns={"repeat(3, 1fr)"} gap={6} className='z-0 bg-gray-100'>
      {currRange.map((month, index) => {
        return (
          <GridItem w="80%" key={index}>
            <Calendar
              activeStartDate={month}
              tileClassName={({ date, view }) => {
                if (
                  view === "month" &&
                  events?.find((event) =>
                    moment(event.start).isSame(moment(date), "day")
                  )
                )
                  return "event-day";
                return null;
              }}
              onClickDay={(day) => {
                onView && onView(Views.DAY);
                onNavigate(day);
              }}
            />
          </GridItem>
        );
      })}
    </Grid>
  );
}

YearView.range = (date, { localizer }) => {
  const start = localizer.startOf(date, "year");
  const end = localizer.endOf(date, "year");

  const range = [];
  let current = start;

  while (localizer.lte(current, end, "year")) {
    range.push(current);
    current = localizer.add(current, 1, "month");
  }

  return range;
};

YearView.navigate = (date, action, { localizer }) => {
  if (action instanceof Date) return action;

  switch (action) {
    case Navigate.NEXT:
      return localizer.add(date, 1, "year");
    case Navigate.PREVIOUS:
      return localizer.add(date, -1, "year");
    default:
      return date;
  }
};

YearView.title = (date, { localizer }) => {
  return localizer.format(date, "YYYY");
};
