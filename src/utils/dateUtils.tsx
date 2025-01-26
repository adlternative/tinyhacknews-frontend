const FormatDate = (date: Date): string => {
  const options = { year: "numeric", month: "long", day: "numeric" } as const;
  return date.toLocaleDateString("en-US", options);
};

export default FormatDate;
