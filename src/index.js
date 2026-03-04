// ✂️ --- الكود النهائي لـ src/index.js في ai-super-worker --- ✂️
export default {
    async fetch(request, env) {
        // 1. التحقق من كلمة السر
        if (request.headers.get('X-Secret-Key') !== env.SECRET_KEY) {
            return new Response('Unauthorized', { status: 401 });
        }
        // 2. التأكد أن الطلب هو POST
        if (request.method !== 'POST') {
            return new Response('Method Not Allowed', { status: 405 });
        }
        // 3. التحقق من وجود ربط AI
        if (!env.AI) {
            return new Response('AI binding is not configured.', { status: 500 });
        }

        try {
            const body = await request.json();
                
            // 4. استدعاء نموذج اللغة مع طلب حد أقصى للتوكنز
            const response = await env.AI.run(
                '@cf/meta/llama-3.1-8b-instruct',
                {
                    ...body, // تمرير الرسائل الأصلية (messages)
                    max_tokens: 1024 // طلب السماح بما يصل إلى 1024 توكن للمخرجات
                }
            );

            return new Response(JSON.stringify(response), {
                headers: { 'Content-Type': 'application/json' },
            });

        } catch (e) {
            return new Response(`Error during AI run: ${e.message}`, { status: 500 });
        }
    },
};
