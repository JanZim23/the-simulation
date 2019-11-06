# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

# Configures the endpoint
config :sim, SimWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "XU24EDN+fewdaTBzuKwuuIM7IXQCoXof3uuF//1jwaW9gR3Aqw8HzX7QrIe6nJe6",
  render_errors: [view: SimWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Sim.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
