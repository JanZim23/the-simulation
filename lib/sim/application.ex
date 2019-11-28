defmodule Sim.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    # List all child processes to be supervised
    children = [
      # Start the endpoint when the application starts
      SimWeb.Endpoint,
      # Starts a worker by calling: Sim.Worker.start_link(arg)
      # {Sim.Worker, arg},
      {Registry, keys: :unique, name: Sim.GameRegistry}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Sim.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    SimWeb.Endpoint.config_change(changed, removed)
    :ok
  end

  defimpl Jason.Encoder, for: Sim.Game.State do
    def encode(x, opts),
      do: x |> Map.from_struct() |> Map.drop([:tick_timer]) |> Jason.Encoder.encode(opts)
  end

  defimpl Jason.Encoder, for: Sim.Game.Metrics do
    def encode(x, opts), do: x |> Map.from_struct() |> Jason.Encoder.encode(opts)
  end

  defimpl Jason.Encoder, for: Sim.Game.Spending do
    def encode(x, opts), do: x |> Map.from_struct() |> Jason.Encoder.encode(opts)
  end

  defimpl Jason.Encoder, for: Sim.Game.Player do
    def encode(x, opts), do: x |> Map.from_struct() |> Jason.Encoder.encode(opts)
  end

  defimpl Jason.Encoder, for: Sim.Event do
    def encode(x, opts), do: x |> Map.from_struct() |> Jason.Encoder.encode(opts)
  end

  defimpl Jason.Encoder, for: Tuple do
    def encode({a, b}, opts), do: [a, b] |> Jason.Encoder.encode(opts)
  end
end
