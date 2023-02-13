// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  // Grab the code from the post

  const code = JSON.parse(req.body).code;

  // Capture STDOUT
  let output = "";
  process.stdout.write = (chunk, encoding, callback) => {
    output += chunk;
  };
  process.stderr.write = (chunk, encoding, callback) => {
    output += chunk;
  };

  // console.log(JSON.stringify(req.body, 0, 2));

  // Evaluate the code
  try {
    eval(code);
  } catch (error) {
    console.error(error);
  }

  res.status(200).json(output);
}
