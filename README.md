# Sim

## Planning

- Phases
  - Sign Up (Select Preferences)
  - Election
  - Term
  - End (15 minutes)

Meters

- Country Budget
- Country Expenditures

  - Health
  - Climate Control
  - Renewable Energy
  - Welfare
  - Natural Disasters

- Global Temperature
  - May not reach
- President Approval Polls

Deltas

- temperature
- deficit
- gdp

Players

- Citizen
- Senator
- President

Admin Controls:

- Start Game: Name
- close elections
- next action
- end game

Messages

Citizens have income (random) ((x/5 + 3)^7)/12 where 0 < x < 10

The president changes the spending

the spending determines the deltas

the detlas are applied to the metric every 10 second

the metrics trigger events (every minute)

events effect metrics (this is where stuff gets interesting)

citizens are affected by metrics.

when (income - %taxes) - cost of living is below 0. Players loose.

To start your Phoenix server:

- Install dependencies with `mix deps.get`
- Install Node.js dependencies with `cd assets && npm install`
- Start Phoenix endpoint with `mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

## Learn more

- Official website: http://www.phoenixframework.org/
- Guides: https://hexdocs.pm/phoenix/overview.html
- Docs: https://hexdocs.pm/phoenix
- Mailing list: http://groups.google.com/group/phoenix-talk
- Source: https://github.com/phoenixframework/phoenix
