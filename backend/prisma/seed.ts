import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { fetchPosterUrl } from '../src/poster/fetch-poster'

const prisma = new PrismaClient()

const FILMS: { title: string; year: number }[] = [
  { title: 'Anora', year: 2024 },
  { title: 'The Brutalist', year: 2024 },
  { title: 'A Complete Unknown', year: 2024 },
  { title: 'Conclave', year: 2024 },
  { title: 'Dune: Part Two', year: 2024 },
  { title: 'Emilia Pérez', year: 2024 },
  { title: "I'm Still Here", year: 2024 },
  { title: 'Nickel Boys', year: 2024 },
  { title: 'The Substance', year: 2024 },
  { title: 'Wicked', year: 2024 },
  { title: 'Sing Sing', year: 2024 },
  { title: 'The Apprentice', year: 2024 },
  { title: 'A Real Pain', year: 2024 },
  { title: 'Flow', year: 2024 },
  { title: 'Inside Out 2', year: 2024 },
  { title: 'Memoir of a Snail', year: 2024 },
  { title: 'Wallace & Gromit: Vengeance Most Fowl', year: 2024 },
  { title: 'The Wild Robot', year: 2024 },
  { title: 'The Girl with the Needle', year: 2024 },
  { title: 'September Says', year: 2024 },
  { title: 'The Seed of the Sacred Fig', year: 2024 },
  { title: 'The Six Triple Eight', year: 2024 },
  { title: 'Elton John: Never Too Late', year: 2024 },
]

async function main() {
  console.log('Seeding database with 97th Academy Awards data (2025)...')

  // Clear seed data in FK-safe order (preserves User accounts)
  await prisma.prediction.deleteMany()
  await prisma.nomination.deleteMany()
  await prisma.film.deleteMany()
  await prisma.category.deleteMany()
  await prisma.edition.deleteMany()

  // ── Edition ─────────────────────────────────────────────────────────────────
  const edition = await prisma.edition.create({
    data: {
      year: 2025,
      name: '97th Academy Awards',
      isCurrent: true,
    },
  })

  // ── Categories ───────────────────────────────────────────────────────────────
  const [
    bestPicture,
    bestDirector,
    bestActress,
    bestActor,
    bestSupportingActress,
    bestSupportingActor,
    bestAnimated,
    bestInternational,
    bestScore,
    bestSong,
  ] = await Promise.all([
    prisma.category.create({ data: { name: 'Best Picture' } }),
    prisma.category.create({ data: { name: 'Best Director' } }),
    prisma.category.create({ data: { name: 'Best Actress' } }),
    prisma.category.create({ data: { name: 'Best Actor' } }),
    prisma.category.create({ data: { name: 'Best Supporting Actress' } }),
    prisma.category.create({ data: { name: 'Best Supporting Actor' } }),
    prisma.category.create({ data: { name: 'Best Animated Feature' } }),
    prisma.category.create({ data: { name: 'Best International Feature Film' } }),
    prisma.category.create({ data: { name: 'Best Original Score' } }),
    prisma.category.create({ data: { name: 'Best Original Song' } }),
  ])

  // ── Poster URLs ──────────────────────────────────────────────────────────────
  console.log('Fetching poster URLs (TMDB → OMDB → Wikipedia)...')
  const posterMap = new Map(
    await Promise.all(
      FILMS.map(async (f) => [f.title, await fetchPosterUrl(f.title, f.year)] as const),
    ),
  )

  const poster = (title: string) => posterMap.get(title) ?? null
  const fetched = Array.from(posterMap.values()).filter(Boolean).length
  console.log(`  ${fetched}/${FILMS.length} posters found`)

  // ── Films ────────────────────────────────────────────────────────────────────
  const [
    anora,
    brutalist,
    completeUnknown,
    conclave,
    dune,
    emiliaPerez,
    imStillHere,
    nickelBoys,
    substance,
    wicked,
    singSing,
    apprentice,
    realPain,
    flow,
    insideOut2,
    memoirSnail,
    wallaceGromit,
    wildRobot,
    girlWithNeedle,
    septemberSays,
    seedOfSacredFig,
    sixTripleEight,
    eltonJohnDoc,
  ] = await Promise.all([
    prisma.film.create({ data: { title: 'Anora', year: 2024, posterUrl: poster('Anora') } }),
    prisma.film.create({
      data: { title: 'The Brutalist', year: 2024, posterUrl: poster('The Brutalist') },
    }),
    prisma.film.create({
      data: { title: 'A Complete Unknown', year: 2024, posterUrl: poster('A Complete Unknown') },
    }),
    prisma.film.create({
      data: { title: 'Conclave', year: 2024, posterUrl: poster('Conclave') },
    }),
    prisma.film.create({
      data: { title: 'Dune: Part Two', year: 2024, posterUrl: poster('Dune: Part Two') },
    }),
    prisma.film.create({
      data: { title: 'Emilia Pérez', year: 2024, posterUrl: poster('Emilia Pérez') },
    }),
    prisma.film.create({
      data: { title: "I'm Still Here", year: 2024, posterUrl: poster("I'm Still Here") },
    }),
    prisma.film.create({
      data: { title: 'Nickel Boys', year: 2024, posterUrl: poster('Nickel Boys') },
    }),
    prisma.film.create({
      data: { title: 'The Substance', year: 2024, posterUrl: poster('The Substance') },
    }),
    prisma.film.create({ data: { title: 'Wicked', year: 2024, posterUrl: poster('Wicked') } }),
    prisma.film.create({
      data: { title: 'Sing Sing', year: 2024, posterUrl: poster('Sing Sing') },
    }),
    prisma.film.create({
      data: { title: 'The Apprentice', year: 2024, posterUrl: poster('The Apprentice') },
    }),
    prisma.film.create({
      data: { title: 'A Real Pain', year: 2024, posterUrl: poster('A Real Pain') },
    }),
    prisma.film.create({ data: { title: 'Flow', year: 2024, posterUrl: poster('Flow') } }),
    prisma.film.create({
      data: { title: 'Inside Out 2', year: 2024, posterUrl: poster('Inside Out 2') },
    }),
    prisma.film.create({
      data: { title: 'Memoir of a Snail', year: 2024, posterUrl: poster('Memoir of a Snail') },
    }),
    prisma.film.create({
      data: {
        title: 'Wallace & Gromit: Vengeance Most Fowl',
        year: 2024,
        posterUrl: poster('Wallace & Gromit: Vengeance Most Fowl'),
      },
    }),
    prisma.film.create({
      data: { title: 'The Wild Robot', year: 2024, posterUrl: poster('The Wild Robot') },
    }),
    prisma.film.create({
      data: {
        title: 'The Girl with the Needle',
        year: 2024,
        posterUrl: poster('The Girl with the Needle'),
      },
    }),
    prisma.film.create({
      data: { title: 'September Says', year: 2024, posterUrl: poster('September Says') },
    }),
    prisma.film.create({
      data: {
        title: 'The Seed of the Sacred Fig',
        year: 2024,
        posterUrl: poster('The Seed of the Sacred Fig'),
      },
    }),
    prisma.film.create({
      data: {
        title: 'The Six Triple Eight',
        year: 2024,
        posterUrl: poster('The Six Triple Eight'),
      },
    }),
    prisma.film.create({
      data: {
        title: 'Elton John: Never Too Late',
        year: 2024,
        posterUrl: poster('Elton John: Never Too Late'),
      },
    }),
  ])

  const e = edition.id

  // ── Nominations ──────────────────────────────────────────────────────────────
  await Promise.all([
    // ── Best Picture ──────────────────────────────────────────────────────────
    // Winner: Anora (Sean Baker)
    prisma.nomination.create({
      data: { editionId: e, filmId: anora.id, categoryId: bestPicture.id, isWinner: true },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: brutalist.id, categoryId: bestPicture.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: completeUnknown.id, categoryId: bestPicture.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: conclave.id, categoryId: bestPicture.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: dune.id, categoryId: bestPicture.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: emiliaPerez.id, categoryId: bestPicture.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: imStillHere.id, categoryId: bestPicture.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: nickelBoys.id, categoryId: bestPicture.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: substance.id, categoryId: bestPicture.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: wicked.id, categoryId: bestPicture.id },
    }),

    // ── Best Director ─────────────────────────────────────────────────────────
    // Winner: Sean Baker (Anora)
    prisma.nomination.create({
      data: { editionId: e, filmId: anora.id, categoryId: bestDirector.id, isWinner: true },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: brutalist.id, categoryId: bestDirector.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: completeUnknown.id, categoryId: bestDirector.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: emiliaPerez.id, categoryId: bestDirector.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: substance.id, categoryId: bestDirector.id },
    }),

    // ── Best Actress ──────────────────────────────────────────────────────────
    // Winner: Demi Moore (The Substance)
    prisma.nomination.create({
      data: { editionId: e, filmId: substance.id, categoryId: bestActress.id, isWinner: true },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: wicked.id, categoryId: bestActress.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: emiliaPerez.id, categoryId: bestActress.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: anora.id, categoryId: bestActress.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: imStillHere.id, categoryId: bestActress.id },
    }),

    // ── Best Actor ────────────────────────────────────────────────────────────
    // Winner: Adrien Brody (The Brutalist)
    prisma.nomination.create({
      data: { editionId: e, filmId: brutalist.id, categoryId: bestActor.id, isWinner: true },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: completeUnknown.id, categoryId: bestActor.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: singSing.id, categoryId: bestActor.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: conclave.id, categoryId: bestActor.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: apprentice.id, categoryId: bestActor.id },
    }),

    // ── Best Supporting Actress ───────────────────────────────────────────────
    // Winner: Zoe Saldaña (Emilia Pérez)
    prisma.nomination.create({
      data: {
        editionId: e,
        filmId: emiliaPerez.id,
        categoryId: bestSupportingActress.id,
        isWinner: true,
      },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: completeUnknown.id, categoryId: bestSupportingActress.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: wicked.id, categoryId: bestSupportingActress.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: brutalist.id, categoryId: bestSupportingActress.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: conclave.id, categoryId: bestSupportingActress.id },
    }),

    // ── Best Supporting Actor ─────────────────────────────────────────────────
    // Winner: Kieran Culkin (A Real Pain)
    prisma.nomination.create({
      data: {
        editionId: e,
        filmId: realPain.id,
        categoryId: bestSupportingActor.id,
        isWinner: true,
      },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: anora.id, categoryId: bestSupportingActor.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: apprentice.id, categoryId: bestSupportingActor.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: singSing.id, categoryId: bestSupportingActor.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: completeUnknown.id, categoryId: bestSupportingActor.id },
    }),

    // ── Best Animated Feature ─────────────────────────────────────────────────
    // Winner: Flow (Gints Zilbalodis)
    prisma.nomination.create({
      data: { editionId: e, filmId: flow.id, categoryId: bestAnimated.id, isWinner: true },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: insideOut2.id, categoryId: bestAnimated.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: memoirSnail.id, categoryId: bestAnimated.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: wallaceGromit.id, categoryId: bestAnimated.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: wildRobot.id, categoryId: bestAnimated.id },
    }),

    // ── Best International Feature Film ───────────────────────────────────────
    // Winner: I'm Still Here (Brazil, dir. Walter Salles)
    prisma.nomination.create({
      data: {
        editionId: e,
        filmId: imStillHere.id,
        categoryId: bestInternational.id,
        isWinner: true,
      },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: emiliaPerez.id, categoryId: bestInternational.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: girlWithNeedle.id, categoryId: bestInternational.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: septemberSays.id, categoryId: bestInternational.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: seedOfSacredFig.id, categoryId: bestInternational.id },
    }),

    // ── Best Original Score ───────────────────────────────────────────────────
    // Winner: The Brutalist (Daniel Blumberg)
    prisma.nomination.create({
      data: { editionId: e, filmId: brutalist.id, categoryId: bestScore.id, isWinner: true },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: conclave.id, categoryId: bestScore.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: emiliaPerez.id, categoryId: bestScore.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: wicked.id, categoryId: bestScore.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: wildRobot.id, categoryId: bestScore.id },
    }),

    // ── Best Original Song ────────────────────────────────────────────────────
    // Winner: "El Mal" (Emilia Pérez)
    prisma.nomination.create({
      data: { editionId: e, filmId: emiliaPerez.id, categoryId: bestSong.id, isWinner: true },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: singSing.id, categoryId: bestSong.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: sixTripleEight.id, categoryId: bestSong.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: eltonJohnDoc.id, categoryId: bestSong.id },
    }),
    prisma.nomination.create({
      data: { editionId: e, filmId: substance.id, categoryId: bestSong.id },
    }),
  ])

  console.log('Seed complete:')
  console.log(`  1 edition   → ${edition.name}`)
  console.log(`  10 categories`)
  console.log(`  23 films`)
  console.log(`  50 nominations`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
