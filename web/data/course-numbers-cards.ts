/**
 * Full number “cards” (legacy `NUMS` 0–100): roman label + masc/fem cardinals + pronunciations.
 * Indices align with `hebrew-v8.2.html` `openNumCards` / `NUMS.roman.length`.
 */

export type NumberCardRow = {
  roman: string;
  masc: string;
  fem: string;
  pronM: string;
  pronF: string;
};

/** 34 rows: 0–10, 11–19, then 20–25 and tens through 100. */
export const NUMBER_CARD_ROWS: readonly NumberCardRow[] = [
  {
    roman: "0",
    masc: "אֶפֶס",
    fem: "אֶפֶס",
    pronM: "efes",
    pronF: "efes",
  },
  {
    roman: "1",
    masc: "אֶחָד",
    fem: "אַחַת",
    pronM: "echad",
    pronF: "achat",
  },
  {
    roman: "2",
    masc: "שְׁנַיִם",
    fem: "שְׁתַּיִם",
    pronM: "shnayim",
    pronF: "shtayim",
  },
  {
    roman: "3",
    masc: "שְׁלֹשָׁה",
    fem: "שָׁלֹשׁ",
    pronM: "shlosha",
    pronF: "shalosh",
  },
  {
    roman: "4",
    masc: "אַרְבָּעָה",
    fem: "אַרְבַּע",
    pronM: "arba'a",
    pronF: "arba",
  },
  {
    roman: "5",
    masc: "חֲמִשָּׁה",
    fem: "חָמֵשׁ",
    pronM: "chamisha",
    pronF: "chamesh",
  },
  {
    roman: "6",
    masc: "שִׁשָּׁה",
    fem: "שֵׁשׁ",
    pronM: "shisha",
    pronF: "shesh",
  },
  {
    roman: "7",
    masc: "שִׁבְעָה",
    fem: "שֶׁבַע",
    pronM: "shiv'a",
    pronF: "sheva",
  },
  {
    roman: "8",
    masc: "שְׁמוֹנָה",
    fem: "שְׁמוֹנֶה",
    pronM: "shmona",
    pronF: "shmone",
  },
  {
    roman: "9",
    masc: "תִּשְׁעָה",
    fem: "תֵּשַׁע",
    pronM: "tish'a",
    pronF: "tesha",
  },
  {
    roman: "10",
    masc: "עֲשָׂרָה",
    fem: "עֶשֶׂר",
    pronM: "asara",
    pronF: "eser",
  },
  {
    roman: "11",
    masc: "אַחַד עָשָׂר",
    fem: "אַחַת עֶשְׂרֵה",
    pronM: "achad asar",
    pronF: "achat esre",
  },
  {
    roman: "12",
    masc: "שְׁנֵים עָשָׂר",
    fem: "שְׁתֵּים עֶשְׂרֵה",
    pronM: "shnem asar",
    pronF: "shteim esre",
  },
  {
    roman: "13",
    masc: "שְׁלֹשָׁה עָשָׂר",
    fem: "שְׁלֹשׁ עֶשְׂרֵה",
    pronM: "shlosha asar",
    pronF: "shlosh esre",
  },
  {
    roman: "14",
    masc: "אַרְבָּעָה עָשָׂר",
    fem: "אַרְבַּע עֶשְׂרֵה",
    pronM: "arba'a asar",
    pronF: "arba esre",
  },
  {
    roman: "15",
    masc: "חֲמִישָּׁה עָשָׂר",
    fem: "חֲמֵשׁ עֶשְׂרֵה",
    pronM: "chamisha asar",
    pronF: "chamesh esre",
  },
  {
    roman: "16",
    masc: "שִׁשָּׁה עָשָׂר",
    fem: "שֵׁשׁ עֶשְׂרֵה",
    pronM: "shisha asar",
    pronF: "shesh esre",
  },
  {
    roman: "17",
    masc: "שִׁבְעָה עָשָׂר",
    fem: "שְׁבַע עֶשְׂרֵה",
    pronM: "shiv'a asar",
    pronF: "shva esre",
  },
  {
    roman: "18",
    masc: "שְׁמוֹנָה עָשָׂר",
    fem: "שְׁמוֹנֶה עֶשְׂרֵה",
    pronM: "shmona asar",
    pronF: "shmone esre",
  },
  {
    roman: "19",
    masc: "תִּשְׁעָה עָשָׂר",
    fem: "תְּשַׁע עֶשְׂרֵה",
    pronM: "tish'a asar",
    pronF: "tesha esre",
  },
  {
    roman: "20",
    masc: "עֶשְׂרִים",
    fem: "עֶשְׂרִים",
    pronM: "esrim",
    pronF: "esrim",
  },
  {
    roman: "21",
    masc: "עֶשְׂרִים וְאֶחָד",
    fem: "עֶשְׂרִים וְאַחַת",
    pronM: "esrim ve'echad",
    pronF: "esrim ve'achat",
  },
  {
    roman: "22",
    masc: "עֶשְׂרִים וּשְׁנַיִם",
    fem: "עֶשְׂרִים וּשְׁתַּיִם",
    pronM: "esrim ushnaim",
    pronF: "esrim ushtayim",
  },
  {
    roman: "23",
    masc: "עֶשְׂרִים וְשָׁלֹשׁ",
    fem: "עֶשְׂרִים וְשָׁלֹשׁ",
    pronM: "esrim veshalosh",
    pronF: "esrim veshalosh",
  },
  {
    roman: "24",
    masc: "עֶשְׂרִים וְאַרְבַּע",
    fem: "עֶשְׂרִים וְאַרְבַּע",
    pronM: "esrim ve'arba",
    pronF: "esrim ve'arba",
  },
  {
    roman: "25",
    masc: "עֶשְׂרִים וְחָמֵשׁ",
    fem: "עֶשְׂרִים וְחָמֵשׁ",
    pronM: "esrim vechamesh",
    pronF: "esrim vechamesh",
  },
  {
    roman: "30",
    masc: "שְׁלֹשִׁים",
    fem: "שְׁלֹשִׁים",
    pronM: "shloshim",
    pronF: "shloshim",
  },
  {
    roman: "40",
    masc: "אַרְבָּעִים",
    fem: "אַרְבָּעִים",
    pronM: "arba'im",
    pronF: "arba'im",
  },
  {
    roman: "50",
    masc: "חֲמִישִּׁים",
    fem: "חֲמִישִּׁים",
    pronM: "chamishim",
    pronF: "chamishim",
  },
  {
    roman: "60",
    masc: "שִׁשִּׁים",
    fem: "שִׁשִּׁים",
    pronM: "shishim",
    pronF: "shishim",
  },
  {
    roman: "70",
    masc: "שִׁבְעִים",
    fem: "שִׁבְעִים",
    pronM: "shiv'im",
    pronF: "shiv'im",
  },
  {
    roman: "80",
    masc: "שְׁמוֹנִים",
    fem: "שְׁמוֹנִים",
    pronM: "shmonim",
    pronF: "shmonim",
  },
  {
    roman: "90",
    masc: "תִּשְׁעִים",
    fem: "תִּשְׁעִים",
    pronM: "tish'im",
    pronF: "tish'im",
  },
  {
    roman: "100",
    masc: "מֵאָה",
    fem: "מֵאָה",
    pronM: "mea",
    pronF: "mea",
  },
] as const;

export const NUMBER_CARD_ROW_COUNT = NUMBER_CARD_ROWS.length;
