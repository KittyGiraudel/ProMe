import type { Race } from "../../types";

/**
 * 6×6 grid: names[d1 - 1][d2 - 1] for a D66 roll (X.Y = first die, second die).
 * Rulebook proper nouns — kept here (not in `messages/fr.ts`) because they are not localized.
 */
export const namesByRace: Record<Race, string[][]> = {
  bruja: [
    ["Ágata", "Galileo", "Carmilia", "Lontana", "Teressa", "Gamilo"],
    ["Delfinio", "Ludélia", "Daldrida", "Keliana", "Isonela", "Sororia"],
    ["Prisca", "Florendino", "Cornelio", "Margarita", "Edna", "Arnica"],
    ["Estrelia", "Sibilia", "Falco", "Lili", "Rosalina", "Édita"],
    ["Dália", "Monarda", "Énice", "Avenca", "Gaudi", "Abil"],
    ["Dolores", "Zolernia", "Minerva", "Alascavar", "Glivina", "Adoniran"],
  ],
  cucurbitus: [
    ["Brubru", "Pepo", "Yana", "Morei", "Nobo", "Silo"],
    ["Lineu", "Bunga", "Largo", "Mungo", "Bodo", "Tingo"],
    ["Mimil", "Gogum", "Bosor", "Dido", "Nabo", "Nilso"],
    ["Belco", "Gribo", "Tamil", "Fanfa", "Guila", "Dodo"],
    ["Tini", "Felca", "Cobodo", "Tilu", "Muni", "Jerim"],
    ["Apopo", "Rumu", "Buqui", "Bira", "Nunumu", "Guito"],
  ],
  kiore: [
    ["Genus", "Tierros", "Zabynnu", "Laokys", "Agafya", "Faas"],
    ["Darynius", "Vaydi", "Uffe", "Pavoy", "Taavy", "Ambroos"],
    ["Oydus", "Jaakko", "Talyko", "Oynora", "Paroiny", "Gyattan"],
    ["Payvoli", "Taynnier", "Alyx", "Veyra", "Gyno", "Yasanima"],
    ["Yutiku", "Tabby", "Qiussay", "Yaffa", "Callisty", "Qyadir"],
    ["Myaiar", "Javvony", "Ellysse", "Ozylla", "Eujy", "Hiiyr"],
  ],
  mousseron: [
    ["Cremoníum", "Pahlandii", "Asconmta", "Armihllí", "Sodlpe", "Bavorhum"],
    ["Auhdur", "Ckaero", "Ahmenidis", "Isetno", "Mektre", "Anmetus"],
    ["Teplome", "Nimtri", "Siobhan", "Rhiyrnm", "Lrhemuin", "Sqverno"],
    ["Bsintio", "Kchyinmo", "Lchalan", "Aeihofe", "Aghaltorn", "Rhiyrzs"],
    ["Zhaphil", "Lybzsi", "Ahrtenor", "Comvrig", "Thautlus", "Descevrus"],
    ["Jyihrt", "Btonie", "Vrymtodius", "Hjimo", "Tyiahje", "Szlohvvenn"],
  ],
};

const LOOKUP_MISSING = "—";

export function lookupName(
  race: Race,
  die1: number,
  die2: number,
): string {
  const r = namesByRace[race];
  return r[die1 - 1]?.[die2 - 1] ?? LOOKUP_MISSING;
}
