defmodule Sim.Game.Messages do
  def broadcast(id, channel, event, message) do
    SimWeb.Endpoint.broadcast(channel <> ":" <> id, event, message)
  end

  def broadcast_event(id, channel, event) do
    broadcast(id, channel, "event", event)
  end

  def broadcast_tick(%Sim.Game.State{id: id} = state) do
    broadcast(id, "game", "tick", state |> Sim.Game.State.export())
    state
  end
end
