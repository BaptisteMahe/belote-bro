import { describe, expect, it } from "@jest/globals";
import {
  LocalClientUser,
  LocalServer,
} from "@/components/networking/local/local-server.model";
import { onDropPlayer } from "@/components/game/choose-team/ChooseTeamModal";

describe("ChooseTeamModal", () => {
  describe("onDropPlayer", () => {
    const players: LocalServer["players"] = {
      left: { id: "left", name: "leftPlayer" } as LocalClientUser,
      top: { id: "top", name: "topPlayer" } as LocalClientUser,
      right: { id: "right", name: "rightPlayer" } as LocalClientUser,
    };

    it("should update the player dropped on the position", () => {
      const updatedPlayers = onDropPlayer(players, {
        player: players.left,
        position: "top",
      });

      expect(updatedPlayers.top).toEqual(players.left);
    });

    it("should update the player that has been dropped on", () => {
      const updatedPlayers = onDropPlayer(players, {
        player: players.left,
        position: "top",
      });

      expect(updatedPlayers.left).toEqual(players.top);
    });
  });
});
