
export const currencies = [
    {value: "USD", label: "$ Dollar", locale: "en-US"},
    {value: "EUR", label: "e Euro", locale: "de-DE"},
    {value: "JPY", label: "Y Yem", locale: "ja-JP"},
    {value: "GBP", label: "E Pound", locale: "en-GB"},
];

export type Currency = (typeof currencies)[0];