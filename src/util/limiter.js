import rateLimit from "express-rate-limit";

const getRateLimitKey = (req) => {
  const queryString = JSON.stringify(req.query);
  return `GET:${req.path}:${queryString}`;
};

const limiter = rateLimit({
  windowMs: 1000,
  max: 1,
  keyGenerator: getRateLimitKey,
  message:
    "Too many requests with the same query parameters. Please try again in a second.",
});

export default limiter;
