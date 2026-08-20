# AgroInTechSol

სასოფლო-სამეურნეო კულტურების მართვის პლატფორმა — პლანტაციები, კრეფა, აწონვა, SMS, TV დაფა.

## ფაილები (deploy → agrointechsol.ge)
| ფაილი | დანიშნულება |
|-------|-------------|
| `index.html` | მთავარი პლატფორმა |
| `krefa.html` | კრეფის მოდული (მკრეფავები, QR, ანგარიში, დასწრება) |
| `awonva.html` | აწონვა (ხელით / პალეტით / ნუმერაცია, SMS, ოფლაინ რიგი) |
| `dafa.html` | TV ლიდერბორდი |

## ბაზა (Supabase — `sql/`)
| ფაილი | დანიშნულება |
|-------|-------------|
| `sql/rls_policies.sql` | Row Level Security — per-user მონაცემთა დაცვა |
| `sql/rpc_functions.sql` | სერვერ-side აგრეგაცია (`season_totals`, `picker_leaderboard`) |
| `sql/picker_num_unique.sql` | მკრეფავის num-ის ატომური, per-user ნუმერაცია |

## Deploy
`claude/gadakhedhe-o3b1ha` ან `main`-ში push → GitHub Actions ავტომატურად ტვირთავს
ფაილებს cPanel-ზე FTP-ით (`.github/workflows/deploy.yml`).

## GAP — ინფორმაციის ბაზა (`gap/`)
დესკტოპზე გასაშვები, ოფლაინ ინფორმაციის ბაზა: ტენდერები, პროექტები, კონტაქტები.
სერვერი არ სჭირდება — `gap/gap-info.html` იხსნება ბრაუზერით და ინფორმაცია ინახება
ავტომატურად (ბრაუზერში + დესკტოპის `gap-info-data.json` ფაილში).
დეტალები: [`gap/README.md`](gap/README.md). საჯარო საიტზე არ იტვირთება (იხ. deploy exclude).
