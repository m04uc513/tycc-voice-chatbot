<style>
.container {
  text-align: center;
}
</style>
m04uc513/tycc-voice-chatbot

# TukuYomiChan Chatbot Challenge

```
Unfortunately, this application only supports Japanese.
However, if you like Japanese anime and are studying Japanese, it may be helpful.

Since this is a machine translation, there is a possibility of errors in the translation. In case of any discrepancies between the following translation and the original text of the Terms of Service (Japanese version), the original text will take precedence.
```

<BR>

[Japanese](/readme-ja.md)

<BR>

<div class="container">
  <img src="./public/tsukuyomi_icon.png" title="TukuYomiChan">
</div>

<BR><BR>

This web application is a voice chatbot developed and operated by **還暦めがねじぃじ**（[@m04uc513](https://twitter.com/m04uc513)）. It uses the public resources of the character "TukuYomiChan" that is currently gaining attention in Japan. For more information about "TukuYomiChan," please see here.

<BR>

## How to Play
This is simply a chatbot that answers human questions with text and speech. It starts when you press the 「チャットする」 button.

First, enter your question. The prompt displays a randomly selected question from about 500 pre-registered Q&A pairs. If you can't think of a question, you can simply enter the question from the prompt. It's convenient to have the voice input enabled on your smartphone or PC.

If the question matches, the answer will be displayed in text and read out. If the chatbot responds with "I couldn't understand. Please try again," it means that the question didn't match any registered ones.

If you ask a question after leaving the chatbot idle for a while, the answer will be displayed in text but won't be read out. This happens because the backend of the application is stopped (Glitch.com automatically stops the backend of web applications if they are idle for more than 5 minutes). To resolve this, simply reload the page (after the Glitch.com startup screen) and it will come back to life.

That's all there is to this game, but when you receive a reply in TukuYomiChan's voice, it feels like you're having a conversation. Is this also the Eliza effect?

<BR>

## About the Software
The source code of this application is available on Github.

As you can see from the code, the chatbot primarily runs on your browser alone. Your questions are not stored (to avoid unnecessary trouble) and can be enjoyed even by young children.

Since it runs on Glitch.com, some may try remixing it, but it requires some techniques to make it work properly. If you have any requests for explanations about the techniques or any other requests or comments, feel free to reach out. I will post an announcement tweet on Twitter, so leave a message there.

<BR>

## Future Plans
Some may question why this application was publicly released, as it seems quite meaningless...

In fact, this application is a preview version of an application under development, scheduled to be released in winter 2023. It was released with only the parts that are currently completed, to let those involved experience the effectiveness of a voice chatbot.

So, please look forward to six months later...

<BR>

## About "TukuYomiChan"
<A NAME="#TUKUYOMICHAN"></A>
The development of this chatbot utilizes the conversation text dataset and illustration materials provided by the free material character "TukuYomiChan" (© Rei Yumesaki).

* [TukuYomiChan Official Website](https://tyc.rei-yumesaki.net/)
* [TukuYomiChan Conversation AI Training Project](https://tyc.rei-yumesaki.net/material/kaiwa-ai/)
* Illustration Materials: [Rei Yumesaki](https://tyc.rei-yumesaki.net/material/illust/)


The voice data used by this chatbot was created using the 
[standard embedded voice library](https://tyc.rei-yumesaki.net/news/sharevox/)
of [SHAREVOX](https://www.sharevox.app/).

That's all.
