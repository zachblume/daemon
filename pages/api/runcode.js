// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  // Grab the code from the post

  // const code = JSON.parse(req.body).code;
  let code = "console.log('testing on vercel');";

  // Capture STDOUT
  let output = "";
  process.stdout.write = (chunk, encoding, callback) => {
    output += chunk;
  };
  process.stderr.write = (chunk, encoding, callback) => {
    output += chunk;
  };

  // Evaluate the code
  try {
    // eval(code);
    console.log("test 2");
  } catch (error) {
    console.error(error);
  }

  res.status(200).json(output);
}
