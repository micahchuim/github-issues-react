
export const encodeQueryString = (params) => {
  const keys = Object.keys(params)
  return keys.length
    ? "?" + keys
      .map(key => encodeURIComponent(key)
        + "=" + encodeURIComponent(params[key]))
      .join("&")
    : ""
}

export function parseLinkHeader(header) {
  if (header.length === 0) {
    throw new Error("input must not be of zero length");
  }

  // Split parts by comma and parse each part into a named link
  return header.split(/(?!\B"[^"]*),(?![^"]*"\B)/).reduce((links, part) => {
    const section = part.split(/(?!\B"[^"]*);(?![^"]*"\B)/);
    if (section.length < 2) {
      throw new Error("section could not be split on ';'");
    }
    const url = section[0].replace(/<(.*)>/, '$1').trim();
    const name = section[1].replace(/rel="(.*)"/, '$1').trim();

    links[name] = url;

    return links;
  }, {});
}

export const getTimeStamp = (timestamp) => {
  const SECOND = 1000,
    MINUTE = SECOND * 60,
    HOUR = MINUTE * 60,
    DAY = HOUR * 24,
    MONTH = DAY * 30,
    YEAR = DAY * 365;

  const timeelapsed = Date.now() - timestamp,
    getElapsedString = (value, unit) => {
      const round = Math.round(timeelapsed / value);
      return `${round} ${unit}${round > 1
        ? 's'
        : ''} ago`;
    };
  if (timeelapsed < MINUTE) {
    return getElapsedString(SECOND, 'second');
  }
  if (timeelapsed < HOUR) {
    return getElapsedString(MINUTE, 'minute');
  }
  if (timeelapsed < DAY) {
    return getElapsedString(HOUR, 'hour');
  }
  if (timeelapsed < MONTH) {
    return getElapsedString(DAY, 'day');
  }
  if (timeelapsed < YEAR) {
    return getElapsedString(MONTH, 'month');
  }
  return getElapsedString(YEAR, 'year');
}

export const getCurrentIssues = (issues, per_page, currentPage) => {
  // Logic for displaying issues
  const indexOfLastIssue = currentPage * per_page;
  const indexOfFirstIssue = indexOfLastIssue - per_page;
  const currentIssues = issues.slice(indexOfFirstIssue, indexOfLastIssue);

  return currentIssues;
}

export const displayPageNumbers = (issues, per_page) => {
     
  // Logic for displaying page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(issues.length / per_page); i++) {
      pageNumbers.push(i);
  }

  return pageNumbers;
}
