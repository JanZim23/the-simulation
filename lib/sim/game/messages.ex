defmodule Sim.Game.Messages do
  def broadcast(id, channel, event, message) do
    SimWeb.Endpoint.broadcast(channel <> ":" <> id, event, message)
  end
end
