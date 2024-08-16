import { Pipe } from 'langbase';

export async function POST(req: Request) {
	try {
		if (!process.env.NEXT_LB_SUMMARIZER_PIPE_API_KEY) {
			throw new Error(
				'Please set NEXT_LB_SUMMARIZER_PIPE_API_KEY in your environment variables.'
			);
		}

		// Get chat prompt messages and threadId from the client.
		const body = await req.json();
		const { email } = body;

		const pipe = new Pipe({
			apiKey: process.env.NEXT_LB_SUMMARIZER_PIPE_API_KEY
		});

		const result = await pipe.generateText({
			messages: [{ role: 'user', content: email }]
		});

		console.log(result.completion);

		return new Response(
			JSON.stringify({
				summary: result.completion
			}),
			{ status: 200 }
		);

		// Handle Langbase response, which is a stream in OpenAI format.
		// const stream = OpenAIStream(response)
		// Respond with a text stream.
		// return new StreamingTextResponse(stream, {
		//   headers: response.headers
		// })
	} catch (error: any) {
		console.error('Uncaught API Error:', error);
		return new Response(JSON.stringify(error), { status: 500 });
	}
}
